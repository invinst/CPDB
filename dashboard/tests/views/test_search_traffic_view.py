from common.tests.core import SimpleTestCase
from search.factories import SuggestionLogFactory
from search.models.suggestion import SuggestionLog


class SearchTrafficTestCase(SimpleTestCase):
    def setUp(self):
        self.login_user()
        self.suggestion_log = SuggestionLogFactory()

    def test_get_search_traffic(self):
        response = self.client.get('/api/dashboard/search-traffic/')
        response.status_code.should.equal(200)

        data = self.json(response)
        set(data.keys()).should.equal({'day', 'week', 'month'})
        for _, item in data.items():
            item.should.contain(self.suggestion_log.search_query)
