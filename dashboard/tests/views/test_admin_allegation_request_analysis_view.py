from django.core.urlresolvers import reverse

from allegation.factories import AllegationFactory
from common.models import Allegation
from common.tests.core import SimpleTestCase
from dashboard.views.allegation_request_view import DOCUMENT_REQUEST_FILTERS
from search.models.suggestion import SuggestionLog


class AdminAllegationRequestAnalysisViewTest(SimpleTestCase):
    def setUp(self):
        self.login_user()
        Allegation.objects.all().delete()

    def tearDown(self):
        SuggestionLog.objects.all().delete()

    def call_allegation_request_analysis(self):
        response = self.client.get(reverse('dashboard-allegation-request-analysis'))
        data = self.json(response)

        return response, data

    def test_return_analaysis_of_document_requests(self):
        AllegationFactory(document_requested=False, document_id=0)  # Missing
        AllegationFactory(document_pending=False, document_requested=True, document_id=0)  # Requested
        AllegationFactory(document_id=1)  # Fulfilled
        AllegationFactory(document_pending=True, document_requested=True)  # Pending

        response, data = self.call_allegation_request_analysis()
        response.status_code.should.equal(200)

        for request_type in DOCUMENT_REQUEST_FILTERS:
            if request_type != 'All':
                data[request_type].should.equal(1)
            else:
                data[request_type].should.equal(4)
