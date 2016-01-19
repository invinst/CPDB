from allegation.factories import OfficerAllegationFactory
from common.tests.core import BaseLiveTestCase


class InvestigationOutcomeFilterTestCase(BaseLiveTestCase):
    def setUp(self):
        super(InvestigationOutcomeFilterTestCase, self).setUp()

        officer_allegation = OfficerAllegationFactory(
            final_outcome_class='disciplined'
            )
        self.investigator = officer_allegation.allegation.investigator

    def get_outcome_tab_at(self, position):
        return self.find_all('.filters > span')[position]

    def test_outcome_filter(self):
        self.visit('/investigator/slugify/{id}'.format(
            id=self.investigator.id
            ))
        self.get_outcome_tab_at(1).click()
        len(self.find_all('.complaint-row')).should.equal(1)
