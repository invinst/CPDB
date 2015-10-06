import random

from allegation.factories import AllegationFactory, AllegationCategoryFactory
from allegation.services.outcome_analytics import OutcomeAnalytics
from allegation.tests.utils.outcome_filter import *
from allegation.tests.views.ui.test_allegation_filter_ui import OUTCOME_CLASS
from common.tests.core import SimpleTestCase
from common.models import Allegation


class OutcomeAnalyticsTestCase(SimpleTestCase):
    def setUp(self):
        self.allegation_category = AllegationCategoryFactory()
        for filter_type in FILTERS:
            for final_finding in FILTERS[filter_type]:
                AllegationFactory(final_finding=final_finding, cat=self.allegation_category,
                                  final_outcome_class=random.choice(OUTCOME_CLASS))

    def test_get_analytics(self):
        allegations = Allegation.objects.all()
        results = OutcomeAnalytics.get_analytics(allegations)

        results['All'].should.equal(number_of_all_created_complaints())
        results['Disciplined'].should.equal(allegations.filter(final_outcome_class='disciplined').count())

        for filter_type in FILTERS:
            results[filter_type].should.equal(len(FILTERS[filter_type]))

    def test_other_count_with_null_outcome_value(self):
        AllegationFactory(final_finding=None)
        results = OutcomeAnalytics.get_analytics(allegations)
        results['Other'].should.equal(len(FILTERS['Other']) + 1)
