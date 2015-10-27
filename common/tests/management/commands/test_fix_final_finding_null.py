from django.core import management
from allegation.factories import AllegationFactory
from common.models import Allegation
from common.tests.core import SimpleTestCase


class TestFixFinalFindingNull(SimpleTestCase):
    def test_fix_races(self):
        allegation = AllegationFactory(final_finding=None)
        management.call_command('fix_final_finding_null')
        allegation = Allegation.objects.get(pk=allegation.id)
        allegation.final_finding.should.equal('ZZ')
