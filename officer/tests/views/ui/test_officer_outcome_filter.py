from allegation.factories import OfficerAllegationFactory
from common.tests.core import BaseLiveTestCase


class OfficerOutcomeFilterTestCase(BaseLiveTestCase):
    def setUp(self):
        super(OfficerOutcomeFilterTestCase, self).setUp()

        officer_allegation = OfficerAllegationFactory(
            final_outcome_class='disciplined'
            )
        self.officer = officer_allegation.officer

    def get_outcome_tab_at(self, position):
        return self.find_all('.filters > span')[position]

    def test_outcome_filter(self):
        self.visit('/officer/slugify/{id}'.format(
            id=self.officer.id
            ))
        self.get_outcome_tab_at(1).click()
        len(self.find_all('.complaint-row')).should.equal(1)
