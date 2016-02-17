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
        suggest_entry['tag_value']['display_value'].should.be.equal(investigator.name)
        suggest_entry['suggest_value'].should.be.equal(expect_investigator_label)
        SuggestInvestigator.query('something wrong')['Investigator'].should.be.equal([])

    def test_suggest_investigator_order(self):
        investigator1 = InvestigatorFactory(name='Daniel Neubeck', complaint_count=5)
        investigator2 = InvestigatorFactory(name='Jack Neubeck', complaint_count=10)

        self.rebuild_index()

        suggest_entries = SuggestInvestigator.query('neu')['Investigator']
        suggest_entries[0]['tag_value']['display_value'].should.be.equal(investigator1.name)
        suggest_entries[1]['tag_value']['display_value'].should.be.equal(investigator2.name)

    def test_suggest_investigator_agency_all(self):
        suggest_entries = SuggestInvestigatorAgency.query('i')['Investigation Agency']

        len(suggest_entries).should.be.equal(2)

    def test_suggest_investigator_agency_ipra(self):
        suggest_entries = SuggestInvestigatorAgency.query('ip')['Investigation Agency']

        len(suggest_entries).should.be.equal(1)

    def test_suggest_investigator_agency_iad(self):
        suggest_entries = SuggestInvestigatorAgency.query('ia')['Investigation Agency']

        len(suggest_entries).should.be.equal(1)
