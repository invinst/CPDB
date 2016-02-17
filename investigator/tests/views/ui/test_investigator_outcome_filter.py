from allegation.factories import OfficerAllegationFactory
from common.tests.mixins.outcome_filter_mixin import OutcomeFilterTestMixin


class InvestigationOutcomeFilterTestCase(OutcomeFilterTestMixin):
    def setUp(self):
        super(InvestigationOutcomeFilterTestCase, self).setUp()

        officer_allegation = OfficerAllegationFactory(
            final_outcome_class='disciplined',
            final_finding='SU'
            )
        self.investigator = officer_allegation.allegation.investigator

        final_findings = ['DS', 'EX', 'NA', 'NC', 'NS', 'UN', 'ZZ']
        [
            OfficerAllegationFactory(
                allegation__investigator=self.investigator, final_finding=code)
            for code in final_findings
        ]

    def test_outcome_filter(self):
        self.visit('/investigator/slugify/{id}'.format(
            id=self.investigator.id
            ))
        self.get_outcome_tab_count().should.equal(7)
        expect_outcome_filters = \
            [('all', 8, 0), ('disciplined', 1, 1), ('sustained', 1, 2),
                ('not-sustained', 1, 3), ('exonerated', 1, 4),
                ('unfouned', 1, 5), ('other', 1, 1)]

        for outcome_filter in expect_outcome_filters:
            self.assert_number_of_complaints_in_tab(
                numbers=outcome_filter[1], position=outcome_filter[2])
