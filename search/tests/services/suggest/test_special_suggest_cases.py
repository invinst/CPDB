from allegation.factories import InvestigatorFactory
from search.tests.services.suggest.base_test_suggest import BaseSuggestTestCase
from search.services.suggest.suggest_investigator import SuggestInvestigator


class SuggestSpecialCasesTestCase(BaseSuggestTestCase):
    def test_string_suggest_cases(self):
        investigator = InvestigatorFactory(name='Jason Van Dyke')

        suggest_cases = ['jaso', 'jason v', 'ja va', 'Ja dyke', 'van dyke']
        self.rebuild_index()

        for suggest_case in suggest_cases:
            suggest_entry = SuggestInvestigator.query(suggest_case)['Investigator'][0]
            suggest_entry['tag_value']['display_value'].should.be.equal(investigator.name)

    def test_apostrophe_suggest_cases(self):
        investigator = InvestigatorFactory(name='O\'brien')

        suggest_cases = ['o', 'bri', 'o\'bri', '\'brie']
        self.rebuild_index()

        for suggest_case in suggest_cases:
            suggest_entry = SuggestInvestigator.query(suggest_case)['Investigator'][0]
            suggest_entry['tag_value']['display_value'].should.be.equal(investigator.name)
