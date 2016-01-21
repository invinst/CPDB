from allegation.factories import OfficerAllegationFactory
from common.tests.mixins.outcome_filter_mixin import OutcomeFilterTestMixin


class OfficerOutcomeFilterTestCase(OutcomeFilterTestMixin):
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
        self.assert_number_of_complaints_in_tab(numbers=1, position=1)
