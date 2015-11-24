from django.core.urlresolvers import reverse

from allegation.factories import AllegationFactory
from common.models import Allegation
from common.tests.core import SimpleTestCase


class AllegationRequestViewTestCase(SimpleTestCase):
    def setUp(self):
        Allegation.objects.all().delete()
        self.no_request_allegation = AllegationFactory(number_of_request=0)
        self.one_request_allegation = AllegationFactory(number_of_request=1)

    def call_document_requests_api(self, params={}):
        response = self.client.get(reverse('allegation-list'), params)
        data = self.json(response)

        return response, data

    def test_ordering(self):
        self.assert_default_sort_order_is_asc_on_number_of_request()
        params = {
            'ordering': 'number_of_request'
        }
        response, data = self.call_document_requests_api(params=params)
        data = data['results']
        data[0]['crid'].should.equal(str(self.no_request_allegation.crid))
        data[1]['crid'].should.equal(str(self.one_request_allegation.crid))

    def assert_default_sort_order_is_asc_on_number_of_request(self):
        response, data = self.call_document_requests_api()
        data = data['results']
        data[0]['crid'].should.equal(str(self.one_request_allegation.crid))
        data[1]['crid'].should.equal(str(self.no_request_allegation.crid))
