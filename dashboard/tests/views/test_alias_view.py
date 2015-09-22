from common.tests.core import SimpleTestCase
from search.models.alias import Alias
from search.factories import AliasFactory, SuggestionLogFactory


class AliasTestCase(SimpleTestCase):
    def setUp(self):
        self.login_user()
        self.alias = None

    def tearDown(self):
        Alias.objects.all().delete()

    def get_aliases(self, query='', page=0):
        return self.client.get('/api/dashboard/alias/', {
            'q': query,
            'page': page
        })

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
        self.get_aliases().status_code.should.equal(200)

    def test_get_aliases_should_return_all_aliases(self):
        alias = 'alias'
        AliasFactory(alias=alias)
        SuggestionLogFactory(query=alias, num_suggestions=1)
        response  = self.get_aliases()
        data = self.json(response)

        len(data['data']).should.equal(1)

    def test_get_aliases_with_query(self):
        alias = 'alias'
        other_alias = 'other'
        AliasFactory(alias=alias)
        AliasFactory(alias=other_alias)

        response  = self.get_aliases('ali')
        data = self.json(response)

        len(data['data']).should.equal(1)

    def test_pagination(self):
        aliases = [AliasFactory() for i in range(16)]
        response  = self.get_aliases()
        data = self.json(response)
        len(data['data']).should.equal(15)
        response  = self.get_aliases('', 1)
        data = self.json(response)
        len(data['data']).should.equal(1)





