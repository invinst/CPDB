from django.core import management

from common.models import Officer
from common.tests.core import SimpleTestCase
from allegation.factories import OfficerFactory


class TestOfficerProfileLink(SimpleTestCase):
    def setUp(self):
        Officer.objects.all().delete()
        self.officer = OfficerFactory(officer_first="First", officer_last="Last", id=1000)

    def tearDown(self):
        self.officer.delete()

    def test_officer_profile_link(self):
        expected_result = 'http://cpdb.co/officer/first-last/1000'
        with open('/tmp/command_output', 'w') as f:
            management.call_command('build_google_sitemap', stdout=f)
        with open('/tmp/command_output', 'r') as f:
            f.readline().strip().should.equal(expected_result)
