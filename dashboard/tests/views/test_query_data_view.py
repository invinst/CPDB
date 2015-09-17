from common.tests.core import SimpleTestCase
from search.factories import SuggestionLogFactory


class QueryDataTestCase(SimpleTestCase):
    def setUp(self):
        self.logs = [SuggestionLogFactory() for i in range(10)]
        self.login_user()

    def test_query_data(self):
        response = self.client.get('/api/dashboard/query-data/', {'start': 0, 'end': 5})

        response.status_code.should.equal(200)
        data = self.json(response)

        data.should.contain('logs')
        data.should.contain('log_counts')

        isinstance(data['logs'], list).should.be.true
        isinstance(data['log_counts'], dict).should.be.true

        count1 = data['log_counts']
        len(data['logs']).should.equal(5)

        response = self.client.get('/api/dashboard/query-data/', {'start': 5, 'end': 10})
        data = self.json(response)
        count2 = data['log_counts']
        len(data['logs']).should.equal(5)

        for query in count1:
            count2.shouldnt.contain(query)