from django.core.urlresolvers import reverse

from common.tests.core import SimpleTestCase
from dashboard.query_builders import DOCUMENT_REQUEST_FILTERS
from document.factories import DocumentFactory
from document.models import Document
from search.models.suggestion import SuggestionLog


class AdminAllegationRequestAnalysisViewTest(SimpleTestCase):
    def setUp(self):
        self.login_user()
        Document.objects.all().delete()

    def tearDown(self):
        SuggestionLog.objects.all().delete()

    def call_allegation_request_analysis(self):
        response = self.client.get(
            reverse('dashboard-allegation-request-analysis'))
        data = self.json(response)

        return response, data

    def test_return_analaysis_of_document_requests(self):
        DocumentFactory(requested=False, documentcloud_id=0)  # Missing
        DocumentFactory(pending=False, requested=True, documentcloud_id=0)  # Requested
        DocumentFactory(documentcloud_id=1)  # Fulfilled
        DocumentFactory(pending=True, requested=True)  # Pending

        response, data = self.call_allegation_request_analysis()
        response.status_code.should.equal(200)

        for request_type in DOCUMENT_REQUEST_FILTERS:
            if request_type != 'All':
                data[request_type].should.equal(1)
            else:
                data[request_type].should.equal(4)
