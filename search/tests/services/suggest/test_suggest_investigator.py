from allegation.factories import InvestigatorFactory
from search.services.suggest.suggest_investigator_agency import SuggestInvestigatorAgency
from common.models import OfficerAllegation
from search.tests.services.suggest.test_suggest_base import SuggestBaseTestCase
from search.services.suggest.suggest_investigator import SuggestInvestigator


class SuggestInvestigatorTestCase(SuggestBaseTestCase):
    def test_suggest_investigator(self):
        investigator = InvestigatorFactory(name='Daniel Neubeck')

        self.rebuild_index()

        num_allegations = OfficerAllegation.objects.filter(allegation__investigator=investigator).count()
        expect_investigator_label = '{name} ({count})'.format(name=investigator.name, count=num_allegations)

        suggest_entry = SuggestInvestigator.query('neu')['Investigator'][0]
        suggest_entry['label'].should.be.equal(expect_investigator_label)
        suggest_entry['value'].should.be.equal(investigator.name)
        SuggestInvestigator.query('something wrong')['Investigator'].should.be.equal([])

    def test_suggest_investigator_order(self):
        investigator1 = InvestigatorFactory(name='Daniel Neubeck', complaint_count=5)
        investigator2 = InvestigatorFactory(name='Jack Neubeck', complaint_count=10)

        self.rebuild_index()

        num_allegations1 = OfficerAllegation.objects.filter(allegation__investigator=investigator1).count()
        num_allegations2 = OfficerAllegation.objects.filter(allegation__investigator=investigator2).count()
        expect_investigator1 = '{name} ({count})'.format(name=investigator1.name, count=num_allegations1)
        expect_investigator2 = '{name} ({count})'.format(name=investigator2.name, count=num_allegations2)

        suggest_entries = SuggestInvestigator.query('neu')['Investigator']
        suggest_entries[0]['label'].should.be.equal(expect_investigator1)
        suggest_entries[1]['label'].should.be.equal(expect_investigator2)

    def test_suggest_investigator_agency_all(self):
        suggest_entries = SuggestInvestigatorAgency.query('i')['Investigation Agency']

        len(suggest_entries).should.be.equal(2)

    def test_suggest_investigator_agency_ipra(self):
        suggest_entries = SuggestInvestigatorAgency.query('ip')['Investigation Agency']

        len(suggest_entries).should.be.equal(1)

    def test_suggest_investigator_agency_iad(self):
        suggest_entries = SuggestInvestigatorAgency.query('ia')['Investigation Agency']

        len(suggest_entries).should.be.equal(1)
