from common.tests.core import SimpleTestCase
from search.models.alias import Alias


class AliasTestCase(SimpleTestCase):
    def setUp(self):
        self.login_user()
        self.alias = None

    def tearDown(self):
        if self.alias:
            self.alias.delete()

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