from django.core import management
from allegation.factories import OfficerFactory
from common.models import Officer
from common.tests.core import SimpleTestCase


class CleanOfficerNamesTestCase(SimpleTestCase):
    def test_correct_obrien(self):
        officer = OfficerFactory(officer_first='tommy', officer_last='obrien')
        management.call_command('capitalize_officer_name')

        officer = Officer.objects.get(pk=officer.pk)
        officer.officer_first.should.equal('Tommy')
        officer.officer_last.should.equal("O'Brien")

    def test_correct_o_apostrophe(self):
        officer = OfficerFactory(officer_first='tommy', officer_last="O'callaghan")
        management.call_command('capitalize_officer_name')

        officer = Officer.objects.get(pk=officer.pk)
        officer.officer_first.should.equal('Tommy')
        officer.officer_last.should.equal("O'Callaghan")
