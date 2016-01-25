from allegation.factories import InvestigatorFactory
from search.tests.services.suggest.test_suggest_base import SuggestBaseTestCase
from search.services.suggest.suggest_investigator import SuggestInvestigator


class SuggestInvestigatorTestCase(SuggestBaseTestCase):
    def test_suggest_investigator(self):
        investigator = InvestigatorFactory(name='Daniel Neubeck')

        self.rebuild_index()

        expect_investigator_label = '{name} ({count})'.format(name=investigator.name, count=investigator.complaint_count)

        suggest_entry = SuggestInvestigator.query('neu')['Investigator'][0]
        suggest_entry['label'].should.be.equal(expect_investigator_label)
        suggest_entry['value'].should.be.equal(investigator.name)
        SuggestInvestigator.query('something wrong')['Investigator'].should.be.equal([])

    def test_suggest_investigator_order(self):
        investigator1 = InvestigatorFactory(name='Daniel Neubeck', complaint_count=5)
        investigator2 = InvestigatorFactory(name='Jack Neubeck', complaint_count=10)

        self.rebuild_index()

        expect_investigator1 = '{name} ({count})'.format(name=investigator1.name, count=investigator1.complaint_count)
        expect_investigator2 = '{name} ({count})'.format(name=investigator2.name, count=investigator2.complaint_count)

        suggest_entries = SuggestInvestigator.query('neu')['Investigator']
        suggest_entries[0]['label'].should.be.equal(expect_investigator1)
        suggest_entries[1]['label'].should.be.equal(expect_investigator2)
