from django.core import management
from allegation.factories import OfficerAllegationFactory
from common.models import OfficerAllegation
from common.tests.core import SimpleTestCase


class TestFixFinalFindingNull(SimpleTestCase):
    def test_fix_races(self):
        officer_allegation = OfficerAllegationFactory(final_finding=None)
        management.call_command('fix_final_finding_null')
        officer_allegation = OfficerAllegation.objects.get(
            pk=officer_allegation.id)
        officer_allegation.final_finding.should.equal('ZZ')
