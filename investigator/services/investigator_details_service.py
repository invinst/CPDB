from django.conf import settings

from common.models import Allegation, OfficerAllegation
from investigator.services.timeline_service import TimelineService


class InvestigatorDetailsService(object):

    @classmethod
    def get_details(cls, investigator):
        allegations = Allegation.objects.filter(investigator=investigator)\
            .exclude(point=None)
        officer_allegations = OfficerAllegation.objects\
            .filter(allegation__in=allegations)
        has_map = officer_allegations.count() > settings.MAP_POINT_THRESHOLD
        timeline = TimelineService.get_timeline(officer_allegations)

        return {
            'officer_allegations': officer_allegations,
            'allegations': allegations,
            'timeline': timeline,
            'has_map': has_map
        }
