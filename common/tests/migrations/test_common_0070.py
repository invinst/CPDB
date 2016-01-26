from django.core import management

from common.tests.core import SimpleTestCase
from allegation.factories import AllegationFactory, InvestigatorFactory


class TestInvestigatorMigration(SimpleTestCase):

    def test_set_investigators(self):
        management.call_command('migrate', 'common', '0070', verbosity=0)
        invalid_investigator = InvestigatorFactory()
        correct_investigator = InvestigatorFactory(raw_name='VAZQUEZ, AURORA')
        allegation = AllegationFactory(crid=1061708, investigator=invalid_investigator)

        management.call_command('migrate', 'common', '0071', verbosity=0)

        allegation.refresh_from_db()
        allegation.investigator_id.should.equal(correct_investigator.id)
