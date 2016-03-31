import csv
import datetime

from django.core.management.base import BaseCommand

from common.models import Officer, OfficerHistory, OfficerBadgeNumber

LAST_NAME = 0
FIRST_NAME = 1
GENDER = 2
RACE = 3
CURRENT_AGE = 4
APPOINTED_DATE = 5
CPD_UNIT_ASSIGNED = 6
EFFECTIVE_DATE = 7
END_DATE = 8
STARS_START = 9
STARS_END = 18

DATE_PARSE_FORMAT = "%d-%b-%y"

OFFICER_RACE_MAPPING = {
    'WHITE': 'White',
    'WHITE HISPANIC': 'White/Hispanic',
    'BLACK': 'Black',
    'ASIAN': 'Asian',
    'NATIVE AMERICAN': 'Native American',
    'ITALIAN': 'Italian',
    'UNKNOWN': 'Unknown',
    'HISPANIC': 'Hispanic',
    'ASIAN/PACIFIC ISLANDER': 'Asian'
}


def fix_date(date):
    if date.year > datetime.datetime.now().year:
        date = date.replace(year=date.year-100)
    return date


class Command(BaseCommand):
    help = 'Import star data'

    def add_arguments(self, parser):
        parser.add_argument('--file')
        parser.add_argument('--debug')

    def get_officer(self, **kwargs):
        order_of_contrain = ['gender', 'race', 'star']
        start_kw = {'officer_first__iexact': kwargs['officer_first'], 'officer_last__iexact': kwargs['officer_last']}

        officers = Officer.objects.filter(**start_kw)

        if officers:
            count = officers.count()

            if count == 1:
                return officers.first()

            if kwargs.get('appt_date'):

                if officers.exclude(appt_date__isnull=True).count() == count:
                    officers = officers.filter(appt_date=kwargs['appt_date'])

                if officers.filter(appt_date=kwargs['appt_date']).count() == 1:
                    return officers.filter(appt_date=kwargs['appt_date']).first()

            for add_filter in order_of_contrain:
                constrain = kwargs.get(add_filter, None)

                if constrain and officers.filter(**{"{field}__iexact".format(field=add_filter): constrain}):
                    officers = officers.filter(**{"{field}__iexact".format(field=add_filter): constrain})

                count = officers.count()

                if count == 1:
                    return officers.first()

            if count == 0:
                raise Officer.DoesNotExist

            self.officers = officers
            raise Officer.MultipleObjectsReturned
        raise Officer.DoesNotExist

    def create_officer(self, row, officers_last_star_num):
        race = row[RACE].capitalize()
        if row[RACE] in OFFICER_RACE_MAPPING:
            race = OFFICER_RACE_MAPPING[row[RACE]]

        officer = Officer(
            officer_first=row[FIRST_NAME].capitalize(),
            officer_last=row[LAST_NAME].capitalize(),
            race=race,
            gender=row[GENDER],
            star=officers_last_star_num
        )

        officer.save()

        self.add_officer_history(officer, row, officers_last_star_num)

    def add_officer_history(self, officer, row, officers_last_star_num):

        end_date = None
        if row[END_DATE]:
            end_date = fix_date(datetime.datetime.strptime(row[END_DATE], DATE_PARSE_FORMAT))

        effective_date = None
        if row[EFFECTIVE_DATE]:
            effective_date = fix_date(datetime.datetime.strptime(row[EFFECTIVE_DATE], DATE_PARSE_FORMAT))

        history = OfficerHistory.objects.filter(
            officer=officer,
            unit=row[CPD_UNIT_ASSIGNED],
            effective_date=effective_date
        )

        if not history.exists():
            history = OfficerHistory(
                officer=officer,
                effective_date=effective_date,
                end_date=end_date,
                unit=row[CPD_UNIT_ASSIGNED]
            )

            history.save()

        for i in range(STARS_START, STARS_END):
            if row[i]:
                badge, created = OfficerBadgeNumber.objects.get_or_create(officer=officer, star=row[i])
                badge.current = row[i] == officers_last_star_num
                badge.save()

        return officer

    def handle(self, *args, **options):
        writer = csv.writer(open('media/officers_import_data.csv', 'w'))

        with open(options['file']) as f:

            reader = csv.reader(f)

            next(reader)
            found_counter = 0
            not_found_counter = 0
            counter = 0
            not_exist_counter = 0

            for row in reader:
                counter += 1
                if counter % 1000 == 0:
                    print(counter)
                if row[APPOINTED_DATE]:
                    appt_date = fix_date(datetime.datetime.strptime(row[APPOINTED_DATE], DATE_PARSE_FORMAT))

                else:
                    appt_date = None

                for i in range(STARS_START, STARS_END):
                    if row[i]:
                        officers_last_star_num = row[i]

                officer = False
                try:
                    officer = self.get_officer(
                        officer_first=row[FIRST_NAME],
                        officer_last=row[LAST_NAME],
                        gender=row[GENDER],
                        race=row[RACE],
                        star=officers_last_star_num,
                        appt_date=appt_date
                    )

                    found_counter += 1

                    self.add_officer_history(officer, row, officers_last_star_num)
                except Officer.MultipleObjectsReturned:
                    not_found_counter += 1
                    possible_matches = ";".join(["%d" % x for x in self.officers.values_list('id', flat=True)])
                    writer.writerow([0] + row + [possible_matches])
                    if options.get('debug'):
                        print(row)
                    continue

                except Officer.DoesNotExist:
                    not_exist_counter += 1
                    writer.writerow([-1] + row)
                    officer = self.create_officer(row, officers_last_star_num)
                    continue

                if not officer:
                    continue
                writer.writerow([officer.pk] + row)
            if options.get('debug'):
                print("found: ", found_counter, " \nnot found: ", not_found_counter, "\nnot exist: ", not_exist_counter)
