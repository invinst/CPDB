from django.conf import settings

from common.models import Allegation, OfficerAllegation
from investigator.services.timeline_service import TimelineService


class InvestigatorDetailsService(object):

    @classmethod
    def get_details(cls, investigator):
        allegations = Allegation.objects.filter(investigator=investigator)
        officer_allegations = OfficerAllegation.objects\
            .filter(allegation__in=allegations)
        has_map = officer_allegations.exclude(allegation__point=None).count() > settings.MAP_POINT_THRESHOLD
        timeline = TimelineService.get_timeline(officer_allegations)
        num_disciplined = OfficerAllegation.disciplined.filter(allegation__investigator=investigator).count()

        return {
            'officer_allegations': officer_allegations,
            'allegations': allegations,
            'num_disciplined': num_disciplined,
            'num_allegations': len(officer_allegations),
            'timeline': timeline,
            'has_map': has_map
        }
