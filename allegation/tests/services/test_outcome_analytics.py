from allegation.factories import (
    AllegationCategoryFactory, OfficerAllegationFactory)
from allegation.services.outcome_analytics import OutcomeAnalytics
from allegation.tests.utils.outcome_filter import (
    number_of_all_created_complaints)
from allegation.services.outcome_analytics import FILTERS
from common.tests.core import SimpleTestCase
from common.models import OfficerAllegation


class OutcomeAnalyticsTestCase(SimpleTestCase):
    def setUp(self):
        super(OutcomeAnalyticsTestCase, self).setUp()
        self.allegation_category = AllegationCategoryFactory()
        for filter_type in FILTERS:
            for final_finding in FILTERS[filter_type]:
                OfficerAllegationFactory(
                    final_finding=final_finding, cat=self.allegation_category)

    def test_get_analytics(self):
        officer_allegations = OfficerAllegation.objects.all()
        results = OutcomeAnalytics.get_analytics(officer_allegations)

        results['All'].should.equal(number_of_all_created_complaints())
        results['Disciplined'].should.equal(officer_allegations.filter(
            final_outcome_class='disciplined').count())

        for filter_type in FILTERS:
            results[filter_type].should.equal(len(FILTERS[filter_type]))

    def test_other_count_with_null_outcome_value(self):
        OfficerAllegationFactory(final_finding=None)

        officer_allegations = OfficerAllegation.objects.all()
        results = OutcomeAnalytics.get_analytics(officer_allegations)
        results['Other'].should.equal(len(FILTERS['Other']) + 1)
