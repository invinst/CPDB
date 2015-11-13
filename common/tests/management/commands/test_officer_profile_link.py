from django.core import management

from common.tests.core import SimpleTestCase
from allegation.factories import OfficerFactory
from common.models import Officer
from common.management.commands.build_google_sitemap import Command


class TestOfficerProfileLink(SimpleTestCase):
    def setUp(self):
        self.officer = OfficerFactory(officer_first="First", officer_last="Last", id=1000)

    def tearDown(self):
        self.officer.delete()

    def test_officer_profile_link(self):
        expected_result = 'http://cpdb.co/#!/officer/first-last/1000'
        Command.officer_profile_link(self.officer).should.equal(expected_result)
