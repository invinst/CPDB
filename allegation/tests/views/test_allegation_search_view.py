from django.core.urlresolvers import reverse
from rest_framework.status import HTTP_301_MOVED_PERMANENTLY

from allegation.factories import OfficerFactory
from common.tests.core import SimpleTestCase


class AllegationSearchViewTest(SimpleTestCase):
    def test_search_officer_should_redirect_to_data_tool_page(self):
        officer = OfficerFactory(officer_first='John', officer_last='Henry')
        response = self.client.get(reverse('allegation:search-page', kwargs={'term': officer.officer_first}))

        response.status_code.should.be.equal(HTTP_301_MOVED_PERMANENTLY)

        response.url.should.contain('/data')

    def test_search_no_result_should_redirect_to_homepage(self):
        response = self.client.get(reverse('allegation:search-page', kwargs={'term': 'no_result'}))

        self.assertRedirects(response, expected_url=reverse('homepage'), status_code=HTTP_301_MOVED_PERMANENTLY)
