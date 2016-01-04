from datetime import datetime, timedelta

from common.tests.core import SimpleTestCase
from common.models import OfficerAllegation
from allegation.factories import AllegationFactory, OfficerAllegationFactory
from investigator.services.timeline_service import TimelineService


class InvestigatorTimelineServiceTestCase(SimpleTestCase):

    def setUp(self):
        base = datetime.now()
        self.dates = [(base + timedelta(days=x)).date() for x in range(0, 2)]
        AllegationFactory(incident_date_only=self.dates[1])
        allegation = AllegationFactory(incident_date_only=None)
        OfficerAllegationFactory(
            allegation=allegation, start_date=self.dates[0])

    def test_investigator_detail_service(self):
        timelines = TimelineService.get_timeline(
            OfficerAllegation.objects.all())
        len(timelines).should.equal(2)
        timelines.should.equal(self.dates)
