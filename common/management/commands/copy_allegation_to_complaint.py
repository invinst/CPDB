from django.core.management.base import BaseCommand

from common.models import Complaint, Allegation


class Command(BaseCommand):
    help = 'Calculate officer complaints count'

    def handle(self, *args, **options):
        for allegation in Allegation.objects.all():
            print(allegation.id)
            try:
                complaint = Complaint.objects.get(crid=allegation.crid)
                if allegation.officer_id:
                    complaint.officers.add(allegation.officer)

                    for area in allegation.areas.all():
                        complaint.areas.add(area)

                    complaint.save()
            except Complaint.DoesNotExist:
                complaint = Complaint()
                complaint.save()

                complaint.areas = list(allegation.areas.all())

                for prop in dir(allegation):
                    if prop[0] != '_' and hasattr(complaint, prop) and getattr(complaint, prop) is None:
                        setattr(complaint, prop, getattr(allegation, prop))

                if allegation.officer_id:
                    complaint.officers.add(allegation.officer)
                complaint.save()
