from django.core import management
from allegation.factories import OfficerFactory
from common.models import Officer
from common.tests.core import SimpleTestCase


class CleanOfficerNamesTestCase(SimpleTestCase):
    def test_correct_last_name_suffix(self):
        OfficerFactory(officer_first='Jr., paul', officer_last='Wiechert')
        management.call_command('clean_officer_names')

        officer = Officer.objects.all()[0]
        officer.officer_first.should.equal('paul')
        officer.officer_last.should.equal('Wiechert Jr.')
