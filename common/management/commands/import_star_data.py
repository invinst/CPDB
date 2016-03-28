import csv
import datetime

from django.core.management.base import BaseCommand

from common.models import Officer  # , OfficerAllegation, Allegation, OfficerHistory, OfficerBadgeNumber

LAST_NAME = 0
FIRST_NAME = 1
SEX_CODE_CD = 2
RACE = 3
CURRENT_AGE = 4
APPOINTED_DATE = 5
COD_UNIT_ASSIGNED = 6
EFFECTIVE_DATE = 7
END_DATE = 8
STARS_START = 9
STARS_END = 18

DATE_PARSE_FORMAT = "%d-%b-%y"


class Command(BaseCommand):
    help = 'Import star data'

    def add_arguments(self, parser):
        parser.add_argument('--file')

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
                    appt_date = datetime.datetime.strptime(row[APPOINTED_DATE], DATE_PARSE_FORMAT)
                    if appt_date.year > datetime.datetime.now().year:
                        appt_date = appt_date.replace(year=appt_date.year-100)
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
                        gender=row[SEX_CODE_CD],
                        race=row[RACE],
                        star=officers_last_star_num,
                        appt_date=appt_date
                    )

                    found_counter += 1
                except Officer.MultipleObjectsReturned:
                    not_found_counter += 1
                    possible_matches = ";".join(["%d" % x for x in self.officers.values_list('id', flat=True)])
                    writer.writerow([0] + row + [possible_matches])
                    print(row)
                    continue

                except Officer.DoesNotExist:
                    not_exist_counter += 1
                    writer.writerow([-1] + row)
                    continue

                if not officer:
                    continue
                writer.writerow([officer.pk] + row)
            print("found: ", found_counter, " \nnot found: ", not_found_counter, "\nnot exist: ", not_exist_counter)
