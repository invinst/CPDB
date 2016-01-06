import mock

from common.tests.core import SimpleTestCase
from allegation.factories import InvestigatorFactory, AllegationFactory
from investigator.services.investigator_details_service import InvestigatorDetailsService


class InvestigatorDetailsServiceTestCase(SimpleTestCase):

    def setUp(self):
        self.investigator = InvestigatorFactory()
        self.allegation = AllegationFactory(point=None, investigator=self.investigator)

    @mock.patch('investigator.services.investigator_details_service.TimelineService')
    def test_get_details(self, mock_timeline_service):
        timeline = 'timeline'
        mock_timeline_service.get_timeline.return_value = timeline

        details = InvestigatorDetailsService.get_details(self.investigator)
        details['allegations'][0].id.should.equal(self.allegation.id)
        details['has_map'].should.be.false
        details['timeline'].should.equal(timeline)
