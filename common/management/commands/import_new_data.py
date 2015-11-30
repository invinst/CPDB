import csv

import datetime

from django.core import management
from django.core.exceptions import ValidationError, MultipleObjectsReturned
from django.core.management.base import BaseCommand
from django.db.models import Q

from common.models import Officer, Allegation, PoliceWitness, Area, AllegationCategory
from common.constants import FOIA_START_DATE


OFFICER_COLS = {
    'officer_first': 2,
    'officer_last': 3,
    'gender': 4,
    'race': 6,
    'appt_date': 7,
    'star': 8,
    'rank': 9,
    'unit': 10,
    'birth_year': 11,
}
ALLEGATION_COLS = {
    'crid': 1,
    'officer': 2,
    'cat': 3,
    'recc_finding': 6,
    'recc_outcome': 7,
    'final_finding': 8,
    'final_outcome': 9,
    'beat': 14,
    'add1': 16,
    'add2': 17,
    'city': 18,
    'incident_date': 19,
    'start_date': 20,
    'end_date': 21,
    'investigator_id': 22,
    'final_outcome_class': 23
}

class Command(BaseCommand):
    help = 'Import new data in csv format'
    wudi_id_mapping = {}

    def add_arguments(self, parser):
        parser.add_argument('--files', nargs=3)

    def handle(self, *args, **options):
        self.rows = {
            'new': [],
            'update': [],
            'undecided': [],
        }

        # self.import_officers(*args, **options)
        self.check_officer_count(*args, **options)
        # self.reassign_allegations(*args, **options)
        # management.call_command('calculate_allegations_count')
        # management.call_command('geocode_allegations')

    def reassign_allegations(self, *args, **options):
        allegation_cache = {}
        for allegation in Allegation.objects.all():
            allegation_cache[allegation.crid] = {
                'number_of_request': allegation.number_of_request,
                'document_id': allegation.document_id,
                'document_normalized_title': allegation.document_normalized_title,
                'document_title': allegation.document_title,
                'document_requested': allegation.document_requested,
                'document_pending': allegation.document_pending,
                'last_requested': allegation.last_requested
            }

        out = csv.writer(open('not_found_allegations.csv', 'w'))
        out.writerow(['id', 'crid', 'officer_id', 'cat_id', 'category', 'allegation_name', 'recc_finding', 'recc_outcome', 'final_finding', 'final_outcome', 'finding_edit', 'result', 'outcome_edit', 'value', 'beat', 'location', 'add1', 'add2', 'city', 'incident_date', 'start_date', 'end_date', 'investigator_id', 'final_outcome_class', ''])

        Allegation.objects.all().delete()
        allegation_file = csv.reader(open(options['files'][1]))
        batch = []
        next(allegation_file)
        counter = 0
        for row in allegation_file:
            if counter % 1000 == 0:
                print(counter)
            counter += 1
            if row[2] in self.wudi_id_mapping:
                officer = self.wudi_id_mapping[row[2]]
                crid = row[1]
                if not crid:
                    continue

                kwargs = {}
                for col in ALLEGATION_COLS:

                    val = row[ALLEGATION_COLS[col]]
                    if val:

                        if col == 'add1':
                            val = int(val) if val else None

                        if col == 'beat':
                            try:
                                val = Area.objects.get(name=val, type='police-beats')
                            except Area.DoesNotExist:
                                val = None
                            except MultipleObjectsReturned:
                                val = Area.objects.filter(name=val, type='police-beats').first()

                        if col == 'cat':
                            try:
                                val = AllegationCategory.objects.get(cat_id=val)
                            except AllegationCategory.DoesNotExist:
                                val = None

                        if col == 'officer':
                            val = officer

                        if col == 'incident_date':
                            if val:
                                val = datetime.datetime.strptime(val, '%Y-%m-%d %H:%M')
                            else:
                                val = '1970-01-01 00:00'

                        if col in ['start_date', 'end_date']:
                            if val:
                                val = datetime.datetime.strptime(val, '%Y-%m-%d')
                            else:
                                val = None

                        kwargs[col] = val
                    else:
                        val = None

                    if crid in allegation_cache:
                        for key in allegation_cache[crid]:
                            if key == 'last_requested':
                                kwargs[key] = datetime.datetime.strftime(allegation_cache[crid][key], '%Y-%m-%d %H:%M:%S')
                            else:
                                kwargs[key] = allegation_cache[crid][key]

                try:
                    Allegation.objects.create(**kwargs)
                except Exception as inst:
                    print(inst, row)

            else:
                out.writerow(row)

    def import_officers(self, *args, **options):
        print('Importing officers...')

        allegation_file = csv.reader(open(options['files'][1]))
        new_prefoia_ids = self.find_new_prefoia_officer_ids(allegation_file)

        prefoia_ids = Allegation.objects.filter(
            incident_date__lt=FOIA_START_DATE
        ).values_list('officer_id', flat=True)
        update_queue = []

        file = csv.reader(open(options['files'][0]))

        Officer.objects.filter(pk__in=[9029, 9016, 8960, 8941]).delete()

        exclude_ids = []
        counter = 0
        next(file)
        for row in file:
            if counter % 1000 == 0:
                print(counter)
            counter += 1
            by_name = Officer.objects.filter(
                officer_first__iexact=row[2],
                officer_last__iexact=row[3]
            ).exclude(pk__in=exclude_ids)
            appt_date_or_star = Q()
            if row[7]:
                appt_date_or_star |= Q(appt_date__icontains=row[7])
            if row[8]:
                appt_date_or_star |= Q(star=float(row[8]))
            officers = by_name.filter(appt_date_or_star)

            #if row[1] == 'AGUILERA, DANIEL':
            #    import pdb; pdb.set_trace()

            if len(officers) == 0:
                self.rows['new'].append(row)
            elif len(officers) == 1:
                update_queue, exclude_ids = self.handle_update(row, officers, update_queue, exclude_ids)
            else:
                if not row[10] or not row[0] in new_prefoia_ids:
                    update_queue = self.handle_undecided(row, officers, update_queue)
                else:
                    officers = officers.filter(id__in=prefoia_ids, unit__icontains=row[10])
                    if len(officers) == 0:
                        self.rows['new'].append(row)
                    elif len(officers) == 1:
                        update_queue, exclude_ids = self.handle_update(row, officers, update_queue, exclude_ids)
                    else:
                        update_queue = self.handle_undecided(row, officers, update_queue)

        for officers, info, row in update_queue:
            officers.update(**info)
            for officer in officers:
                self.wudi_id_mapping[row[0]] = officer

        for row in self.rows['new']:
            info = self.build_officer_info(row)
            officer = Officer.objects.create(**info)
            self.wudi_id_mapping[row[0]] = officer

        for group in self.rows:
            print(group + ' officers: ' + str(len(self.rows[group])))

    def find_new_prefoia_officer_ids(self, file):
        ids = []

        next(file)
        for row in file:
            if row[19] and datetime.datetime.strptime(row[19].split(' ')[0], '%Y-%m-%d') <  datetime.datetime.strptime(FOIA_START_DATE, '%Y-%m-%d'):
                ids.append(row[2])

        return ids

    def handle_undecided(self, row, officers, update_queue):
        to_delete = max([o.id for o in officers])
        to_keep = officers.exclude(id=to_delete)
        if len(to_keep) == 1:
            Allegation.objects.filter(officer_id=to_delete).update(officer_id=to_keep.first().id)
            PoliceWitness.objects.filter(officer_id=to_delete).update(officer_id=to_keep.first().id)
            officers.filter(id=to_delete).delete()
            update_queue.append((to_keep, self.build_officer_info(row), row))
            # solution = input('Officer ID to update or "c" to create. Delete manually in db and "s" to skip:')
            # if solution == 'c':
            #     self.rows['new'].append(row)
            # elif solution != 's':
            #     update = officers.filter(id=solution)
            #     update_queue.append((update, self.build_officer_info(row), row))
        else:
            print('Row %s' % row[0])

        return update_queue

    def handle_update(self, row, officers, update_queue, exclude_ids):
        if officers[0].id in [x[0].id for x,y,z in update_queue]:
            self.rows['new'].append(row)
        else:
            self.rows['update'].append(row)
            update_queue.append((officers, self.build_officer_info(row), row))
            exclude_ids.append(officers.first().id)

        return update_queue, exclude_ids

    def build_officer_info(self, row):
        info = {}
        for col in OFFICER_COLS:
            if row[OFFICER_COLS[col]]:
                info[col] = row[OFFICER_COLS[col]]
            else:
                info[col] = None

        return info

    def check_officer_count(self, *args, **options):
        print('Comparing officers...')

        mismatched = {
            'less': [],
            'more': [],
        }

        file = csv.reader(open(options['files'][2]))
        next(file)
        for row in file:
            name = row[0].split(', ', maxsplit=1)
            count = int(row[2])
            officers = Officer.objects.filter(
                officer_first__iexact=name[1],
                officer_last__iexact=name[0]
            )
            if len(officers) < count:
                mismatched['less'].append(row)
            elif len(officers) > count:
                mismatched['more'].append(row)
            else:
                officer = officers[0]
                if row[4] != officer.allegations_count:
                    print('Different allegation count for %s' % officer.id)

        for group in mismatched:
            print(group, str(len(mismatched[group])))
        print(mismatched['less'])
        print(mismatched['more'])
