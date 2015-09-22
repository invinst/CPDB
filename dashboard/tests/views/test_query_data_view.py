from common.tests.core import SimpleTestCase
from search.factories import SuggestionLogFactory
from search.models.suggestion import SuggestionLog


class QueryDataTestCase(SimpleTestCase):
    def setUp(self):
        SuggestionLog.objects.all().delete()
        self.logs = [SuggestionLogFactory() for i in range(16)]
        self.login_user()

    def test_query_data(self):
        response = self.client.get('/api/dashboard/query-data/')

        response.status_code.should.equal(200)
        data = self.json(response)

        data.should.contain('data')
        data.should.contain('usage')

        isinstance(data['data'], list).should.be.true
        isinstance(data['usage'], dict).should.be.true

        count1 = data['data']
        len(data['usage']).should.equal(15)

        response = self.client.get('/api/dashboard/query-data/', {'page': 1})
        data = self.json(response)
        count2 = data['data']
        len(data['usage']).should.equal(1)

        for query in count1:
            count2.shouldnt.contain(query)

        self.logs[0].num_suggestions = 0
        self.logs[0].save()
        response = self.client.get('/api/dashboard/query-data/', {'fail': 1})
        data = self.json(response)
        for log in data['data']:
            log['num_suggestions'].should.equal(0)

        q = self.logs[0].query[0]
        response = self.client.get('/api/dashboard/query-data/', {'q': q})
        data = self.json(response)
        for log in data['data']:
            log['query'][0].should.equal(q)
