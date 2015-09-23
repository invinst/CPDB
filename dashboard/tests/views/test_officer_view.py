from allegation.factories import OfficerFactory
from common.models import Officer
from common.tests.core import SimpleTestCase


class OfficerTestCase(SimpleTestCase):
    def setUp(self):
        Officer.objects.all().delete()
        self.officers = [OfficerFactory() for i in range(16)]
        self.login_user()

    def test_search_officer(self):
        query = self.officers[0].officer_first[0:2]
        response = self.client.get('/api/dashboard/officer/', {'q': query})

        response.status_code.should.equal(200)
        data = self.json(response)

        data.should.contain('officers')
        for row in data['officers']:
            matchs = [row['officer_first'][0:2], row['officer_last'][0:2]]
            matchs.should.contain(query)
