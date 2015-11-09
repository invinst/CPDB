import csv
from datetime import datetime

from django.core.exceptions import ObjectDoesNotExist
from django.core.management.base import BaseCommand

from common.models import Allegation, Area, Investigator

COLS = {
    'crid': 0,
    'beat': 3,
    'location': 5,
    'add1': 8,
    'add2': 9,
    'city': 15,
    'incident_date': 17,
    'start_date': 24,
    'end_date': 26,
    'investigator_name': 21,
    'END_OF_RECORD':16,
}

END_DATE_FORMAT = "%d-%b-%Y"
START_DATE_FORMAT = "%d %b %Y"
INCIDENT_DATE_TIME_FORMAT = "%d-%b-%Y  %H:%M "

class Command(BaseCommand):
    help = 'Import csv data'
    counters = {
        'created': 0,
        'updated': 0
    }

    def add_arguments(self, parser):
        parser.add_argument('--file')
        parser.add_argument('--start-row')

    def get_vals_init(self):
        return {
            'crid': '',
            'location': '',
            'add1': None,
            'add2': None,
            'city': None,
            'incident_date': None,
            'start_date': None,
            'end_date': None,
            'investigator_name': '',
        }

    def handle(self, *args, **options):

        if not options.get('start_row',"").isnumeric():
            print("Please enter a numerical --start-row options")
            sys.exit()

        start_row = int(options.get('start_row')) - 1
        added_crids = {}
        with open(options['file']) as f:
            reader = csv.reader(f)
            vals = self.get_vals_init()
            beat = False
            counter = 0
            for row in reader:
                if counter < start_row:
                    counter += 1
                    continue

                for col in COLS:
                    val = row[COLS[col]]

                    if val and val != '----':
                        if val:
                            if col == 'incident_date':

                                val = datetime.strptime(val,
                                                        INCIDENT_DATE_TIME_FORMAT)
                                vals['incident_date_only'] = val.date()

                            elif col == 'start_date':
                                val = datetime.strptime(val,
                                                        START_DATE_FORMAT)
                            elif col == 'end_date':
                                val = datetime.strptime(val,
                                                        END_DATE_FORMAT)

                            elif col == 'beat':
                                try:
                                    beat = Area.objects.filter(name=val.zfill(4), type='police-beats').first()

                                except Area.DoesNotExist:
                                    beat = False
                                    print("Beat not found %s" % val)

                                val = False

                            elif col == 'investigator_name':
                                investigator, created = Investigator.objects.get_or_create(raw_name=val)
                                vals['investigator'] = investigator

                        if 'END_OF_RECORD' == col:

                            allegations = Allegation.objects.filter(crid=vals['crid'])

                            if allegations.exists() and vals['crid'] not in added_crids:
                                allegations.update(**vals)
                                self.counters['updated'] += allegations.count()

                            else:
                                allegation = Allegation.objects.create(**vals)
                                allegations = [allegation]
                                self.counters['created'] += 1
                                added_crids[vals['crid']] = True

                            if beat:
                                for allegation in allegations:
                                    allegation.areas.add(beat)

                            vals = self.get_vals_init()

                        elif val:
                            vals[col] = val

        print(self.counters)