from common.tests.core import SimpleTestCase
from search.models.alias import Alias
from search.factories import AliasFactory, SuggestionLogFactory


class AliasTestCase(SimpleTestCase):
    def setUp(self):
        self.login_user()
        self.alias = None

    def tearDown(self):
        Alias.objects.all().delete()

    def get_aliases(self, params={}):
        response = self.client.get('/api/dashboard/alias/', params)
        data = self.json(response)

        return response, data

    def test_create_alias(self):
        response = self.client.post('/api/dashboard/alias/', {
            'alias': 'alias',
            'target': 'target',
        })

        response.status_code.should.equal(201)

        self.alias = Alias.objects.get(alias='alias')
        self.alias.target.should.equal('target')

        response = self.client.post('/api/dashboard/alias/', {
            'alias': 'alias',
            'target': 'target',
        })
        response.status_code.shouldnt.equal(201)

    def test_get_aliases_should_return_status_200(self):
        response, data = self.get_aliases()
        response.status_code.should.equal(200)

    def test_get_aliases_should_return_all_aliases(self):
        alias = 'alias'
        AliasFactory(alias=alias)
        SuggestionLogFactory(search_query=alias, num_suggestions=1)

        response, data = self.get_aliases()

        len(data['data']).should.equal(1)

    def test_get_aliases_with_query(self):
        alias = 'alias'
        other_alias = 'other'
        q = 'ali'
        AliasFactory(alias=alias)
        AliasFactory(alias=other_alias)

        response, data = self.get_aliases({ 'q' : q})

        len(data['data']).should.equal(1)
        data['data'][0]['alias'].should.contain(q)

    def test_pagination(self):
        aliases = [AliasFactory() for i in range(16)]

        response, data  = self.get_aliases()
        len(data['data']).should.equal(15)

        response, data  = self.get_aliases({ 'page': 1 })
        len(data['data']).should.equal(1)

    def test_sort_order(self):
        alias1 = AliasFactory(alias='alias1', num_usage=1)
        alias3 = AliasFactory(alias='alias2', num_usage=3)
        alias2 = AliasFactory(alias='alias3', num_usage=2)

        response, data = self.get_aliases({ 'order_by': '-num_usage'})
        data = data['data']
        data[0]['alias'].should.equal('alias2')
        data[1]['alias'].should.equal('alias3')
        data[2]['alias'].should.equal('alias1')

    def test_bad_sort_order(self):
        response, data = self.get_aliases({ 'order_by': 'abcxyz'})
        response.status_code.should.equal(200)
        data.should.contain('error')
