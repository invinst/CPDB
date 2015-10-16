from common.tests.core import SimpleTestCase
from search.factories import SuggestionLogFactory
from search.models.suggestion import SuggestionLog


class QueryDataTestCase(SimpleTestCase):
    def setUp(self):
        self.login_user()

    def tearDown(self):
        SuggestionLog.objects.all().delete()

    def call_query_data_api(self, params={}):
        response = self.client.get('/api/dashboard/query-data/', params)
        data = self.json(response)

        return response, data

    def test_success_call_with_pagination(self):
        SuggestionLog.objects.all().delete()
        self.logs = [SuggestionLogFactory() for i in range(16)]

        response, data = self.call_query_data_api()
        data.should.contain('data')
        isinstance(data['data'], list).should.be.true
        len(data['data']).should.equal(15)

        response, data = self.call_query_data_api({'page': 1})
        len(data['data']).should.equal(1)

    def test_api_call_with_num_suggestions_filter(self):
        SuggestionLogFactory(num_suggestions=0)
        SuggestionLogFactory(num_suggestions=1)

        response, data = self.call_query_data_api({'fail': 1})

        len(data['data']).should.equal(1)
        data['data'][0]['num_suggestions'].should.equal(0)

    def test_search_by_query_call(self):
        SuggestionLogFactory(search_query='query')
        SuggestionLogFactory(search_query='other')
        q = 'qu'

        response, data = self.call_query_data_api({'q': q})

        len(data['data']).should.equal(1)
        data['data'][0]['search_query'].should.contain(q)

    def test_bad_request_with_invalid_sort_order(self):
        response, data = self.call_query_data_api({'order_by': 'abcxyz'})
        response.status_code.should.equal(400)
        data.should.contain('error')

    def test_sort_order(self):
        SuggestionLogFactory.create_batch(search_query='query1', size=2)
        SuggestionLogFactory.create_batch(search_query='query2', size=4)
        SuggestionLogFactory.create_batch(search_query='query3', size=3)

        response, data = self.call_query_data_api({'order_by': '-num_usage'})
        data = data['data']

        data[0]['search_query'].should.equal('query2')
        data[1]['search_query'].should.equal('query3')
        data[2]['search_query'].should.equal('query1')
