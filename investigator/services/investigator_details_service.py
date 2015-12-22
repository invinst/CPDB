from django.conf import settings

from common.models import Allegation
from investigator.services.timeline_service import TimelineService


class InvestigatorDetailsService(object):

    @classmethod
    def get_details(cls, investigator):
        allegations = Allegation.objects.filter(investigator=investigator)
        has_map = allegations.exclude(point=None).count() > settings.MAP_POINT_THRESHOLD
        timeline = TimelineService.get_timeline(allegations)

        return {
            'allegations': allegations,
            'timeline': timeline,
            'has_map': has_map
        }
