import csv

import datetime
from django.core.management.base import BaseCommand
from django.db.models import Q

from common.models import Officer, Allegation, PoliceWitness
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

        self.import_officers(*args, **options)
        self.check_officer_count(*args, **options)
        self.reassign_allegations(*args, **options)

    def reassign_allegations(self, *args, **options):
        file = csv.reader(open(options['files'][1]))
        next(file)
        not_found_allegations = []
        updated = []
        for row in file:
            if row[2] in self.wudi_id_mapping:
                officer = self.wudi_id_mapping[row[2]]

                crid = row[1]
                allegations = Allegation.objects.filter(crid=crid)
                if allegations.count() == 1:
                    allegations.update(officer=officer)
                    updated.append([crid, row[2], officer.id])

                elif allegations.count() > 1:
                    allegations = allegations.filter(officer__officer_first__iexact=officer.officer_first,
                                                     officer__officer_last__iexact=officer.officer_last)
                    if allegations.count() == 1:
                        allegations.update(officer=officer)
                        updated.append([crid, row[2], officer.id])
                else:
                    not_found_allegations.append(row)

        print(not_found_allegations)

    def import_officers(self, *args, **options):
        print('Importing officers...')

        allegation_file = csv.reader(open(options['files'][1]))
        new_prefoia_ids = self.find_new_prefoia_officer_ids(allegation_file)

        prefoia_ids = Allegation.objects.filter(
            incident_date__lt=FOIA_START_DATE
        ).values_list('officer_id', flat=True)
        update_queue = []

        file = csv.reader(open(options['files'][0]))
        next(file)
        for row in file:
            by_name = Officer.objects.filter(
                officer_first__iexact=row[2],
                officer_last__iexact=row[3]
            )
            appt_date_or_star = Q()
            if row[7]:
                appt_date_or_star |= Q(appt_date__icontains=row[7])
            if row[8]:
                appt_date_or_star |= Q(star=float(row[8]))
            officers = by_name.filter(appt_date_or_star)

            if len(officers) == 0:
                self.rows['new'].append(row)
            elif len(officers) == 1:
                update_queue = self.handle_update(row, officers, update_queue)
            else:
                if not row[10] or not row[0] in new_prefoia_ids:
                    self.rows['undecided'].append(row)
                else:
                    officers = officers.filter(id__in=prefoia_ids, unit__icontains=row[10])
                    if len(officers) == 0:
                        self.rows['new'].append(row)
                    elif len(officers) == 1:
                        update_queue = self.handle_update(row, officers, update_queue)
                    else:
                        self.rows['undecided'].append(row)

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

    def handle_update(self, row, officers, update_queue):
        if officers[0].id in [x[0].id for x,y,z in update_queue]:
            self.rows['new'].append(row)
        else:
            self.rows['update'].append(row)
            update_queue.append((officers, self.build_officer_info(row), row))

        return update_queue

    def build_officer_info(self, row):
        info = {}
        for col in OFFICER_COLS:
            if row[OFFICER_COLS[col]]:
                info[col] = row[OFFICER_COLS[col]]

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
                diff = len(officers) - count
                id_list = officers.values_list('id', flat=True)
                for i in range(len(id_list)):
                    Allegation.objects.filter(officer_id=id_list[i]).update(officer_id=id_list[i+1])
                    PoliceWitness.objects.filter(officer_id=id_list[i]).update(officer_id=id_list[i+1])

                    officers.filter(id=id_list[i]).delete()
                    diff -= 1
                    if diff == 0:
                        break

        for group in mismatched:
            print(group, str(len(mismatched[group])))
        print(mismatched['less'])
        print(mismatched['more'])
