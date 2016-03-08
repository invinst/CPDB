import re

from django.core.management.base import BaseCommand

from common.models import Officer, Investigator

IRISH_O_NAMES = ['Obrien']


class Command(BaseCommand):
    help = 'Correct officer name'

    def correct_name(self, name):
        parts = [x.capitalize() for x in name.split()]
        if parts[0] in IRISH_O_NAMES:
                name = parts[0][1:]
                parts[0] = "O'%s" % name.capitalize()

        if name.startswith("O'"):
            parts[0] = "O'%s" % name[2:].capitalize()

        elif len(parts) > 1:
            if re.match('^[iIvVxX]+$', parts[-1]):
                # Mark Loop Iv —> Mark Loop IV
                # Mark Loop Iii —> Mark Loop III
                parts[-1] = parts[-1].upper()
            elif len(parts[-1]) == 2:
                # John Verlak sr —> John Verlak Sr.
                parts[-1] = parts[-1].capitalize()

        return " ".join(parts)

    def handle(self, *args, **options):
        for officer in Officer.objects.all():
            officer.officer_first = officer.officer_first.capitalize()
            officer.officer_last = self.correct_name(officer.officer_last)

            officer.save()

        for investigator in Investigator.objects.filter():
            raw_name = investigator.raw_name
            names = [x.strip() for x in raw_name.split(',')]
            first_name = names[1].capitalize()
            last_name = self.correct_name(names[0])
            investigator.name = "{first} {last}".format(first=first_name, last=last_name)

            investigator.save()

        print("Done")
