import json
import mock

from django.core.urlresolvers import reverse

from allegation.factories import InvestigatorFactory
from common.tests.core import SimpleTestCase


class InvestigatorDetailViewTestCase(SimpleTestCase):

    def setUp(self):
        self.investigator = InvestigatorFactory()

    @mock.patch('investigator.views.investigator_detail_view.InvestigatorDetailsService')
    def test_get_investigator(self, mock_investigator_details_serivce):
        allegations = 'allegations'
        timeline = 'timeline'
        has_map = 'has_map'

        details = {
            'allegations': allegations,
            'timeline': timeline,
            'has_map': has_map
        }
        mock_investigator_details_serivce.get_details.return_value = details

        response = self.client.get(reverse('investigator:detail'), {
            'pk': self.investigator.id
        })

        response = json.loads(response.content.decode())

        response['investigator']['id'].should.equal(self.investigator.id)
        response['allegations'].should.equal(allegations)
        response['timeline'].should.equal(timeline)
        response['has_map'].should.equal(has_map)
