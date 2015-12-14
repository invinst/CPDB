from django.core.urlresolvers import reverse
from rest_framework import status

from common.tests.core import SimpleTestCase
from search.factories import SuggestionLogFactory


class SearchTrafficTestCase(SimpleTestCase):
    def setUp(self):
        self.login_user()
        self.url_enpoint = reverse('dashboard-search-traffic')

    def call_search_traffic_api(self):
        response = self.client.get(self.url_enpoint)
        data = self.json(response)

        return response, data

    def test_get_search_traffic(self):
        suggestion_log = SuggestionLogFactory()

        response, data = self.call_search_traffic_api()
        response.status_code.should.equal(status.HTTP_200_OK)

        set(data.keys()).should.equal({'day', 'week', 'month'})
        for _, item in data.items():
            item.should.contain(suggestion_log.search_query)

    def test_get_search_traffic_with_bad_characters(self):
        SuggestionLogFactory(search_query="bad'searchquery")

        response, data = self.call_search_traffic_api()

        response.status_code.should.equal(status.HTTP_200_OK)
