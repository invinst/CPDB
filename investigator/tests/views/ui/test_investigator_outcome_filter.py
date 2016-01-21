from allegation.factories import OfficerAllegationFactory
from common.tests.mixins.outcome_filter_mixin import OutcomeFilterTestMixin


class InvestigationOutcomeFilterTestCase(OutcomeFilterTestMixin):
    def setUp(self):
        super(InvestigationOutcomeFilterTestCase, self).setUp()

        officer_allegation = OfficerAllegationFactory(
            final_outcome_class='disciplined'
            )
        self.investigator = officer_allegation.allegation.investigator

    def test_outcome_filter(self):
        self.visit('/investigator/slugify/{id}'.format(
            id=self.investigator.id
            ))
        self.assert_number_of_complaints_in_tab(numbers=1, position=1)
