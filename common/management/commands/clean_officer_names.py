from django.core.management.base import BaseCommand

from common.models import Officer


class Command(BaseCommand):
    help = 'Clean Officer Names'

    def handle(self, *args, **options):
        for officer in Officer.objects.filter():
            if officer.officer_first:
                officer.officer_first = officer.officer_first.capitalize()
            if officer.officer_last:
                officer.officer_last = officer.officer_last.capitalize()

            suffixes = ['jr', 'sr']
            for suffix in suffixes:
                lowered_first_name = officer.officer_first.lower()
                if suffix in lowered_first_name:
                    capitalized_suffix = '{first_letter}{the_rest}'.format(
                        first_letter=suffix[:1].upper(), the_rest=suffix[1:])
                    officer.officer_last = '{last} {suffix}.'.format(
                        last=officer.officer_last, suffix=capitalized_suffix)

                    letters_to_strip = '{suffix}{upper_suffix},. '.format(
                        suffix=suffix, upper_suffix=suffix.upper())
                    officer.officer_first = officer.officer_first.strip(letters_to_strip)

            officer.save()

        to_clean = [
            [' jr', ' Jr'],
            [' iv', ' IV'],
            [' iii', ' III'],
            [' ii', ' II'],
            [' sr', ' Sr'],
        ]

        for clean in to_clean:
            for officer in Officer.objects.filter(officer_last__endswith=clean[0]):
                officer.officer_last = officer.officer_last.replace(clean[0], clean[1])
                officer.save()
