from django.core.management import call_command
from django.test.testcases import TransactionTestCase

from allegation.factories import InvestigatorFactory
from common.models import Investigator


class TestImportInvestigatorRank(TransactionTestCase):

    start_migration = '0070_investigator_agency'
    end_migration = '0072_auto_20160119_0516'
    django_application = 'common'
    model = 'Investigator'

    def setUp(self):
        super(TestImportInvestigatorRank, self).setUp()

        call_command('migrate', self.django_application, self.start_migration, verbosity=0)
        InvestigatorFactory(raw_name='ABBRUZZESE, WILLIAM')
        InvestigatorFactory(raw_name='ADDINGTON, MARC')
        InvestigatorFactory(raw_name='ADRIAN, CHERI', agency='IAD')
        call_command('migrate', self.django_application, self.end_migration, verbosity=0)

    def test_import(self):
        Investigator.objects.filter(agency='IPRA').count().should.equal(2)
        Investigator.objects.filter(agency='IAD').count().should.equal(1)
