from django.core.urlresolvers import reverse

from common.tests.core import SimpleTestCase
from document.factories import DocumentFactory
from document.models.document import Document


class AllegationRequestViewTestCase(SimpleTestCase):
    def setUp(self):
        Document.objects.all().delete()
        self.no_request_document = DocumentFactory(number_of_request=0)
        self.one_request_document = DocumentFactory(number_of_request=1)

    def call_document_requests_api(self, params={}):
        response = self.client.get(reverse('document-list'), params)
        data = self.json(response)

        return response, data

    def test_ordering(self):
        self.assert_default_sort_order_is_asc_on_number_of_request()
        params = {
            'ordering': 'number_of_request'
        }
        response, data = self.call_document_requests_api(params=params)
        data = data['results']
        data[0]['allegation'].should.equal(str(self.no_request_document.allegation.crid))
        data[1]['allegation'].should.equal(str(self.one_request_document.allegation.crid))

    def assert_default_sort_order_is_asc_on_number_of_request(self):
        response, data = self.call_document_requests_api()
        data = data['results']
        data[0]['allegation'].should.equal(str(self.one_request_document.allegation.crid))
        data[1]['allegation'].should.equal(str(self.no_request_document.allegation.crid))
