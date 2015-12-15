from common.models import Allegation
from django.core.management.base import BaseCommand
from django.db.models.query_utils import Q


class Command(BaseCommand):

    def handle(self, *args, **options):
        q = Q(Q(beat=None) | Q(point=None))
        counter = {
            'fail': 0,
            'success': 0
        }
        for allegation in Allegation.objects.all().exclude(q):
            if not allegation.beat.polygon.contains(allegation.point):
                print("{crid}'s point is not within its beat {beat}".format(
                    crid=allegation.crid,
                    beat=allegation.beat.name
                ))
                counter['fail'] += 1
            else:
                counter['success'] += 1
        print(counter)