import random

from allegation.factories import AllegationCategoryFactory, AllegationFactory
from allegation.tests.utils.outcome_filter import number_of_all_created_complaints
from allegation.services.outcome_analytics import FILTERS
from common.tests.core import BaseLiveTestCase
from common.models import Allegation, AllegationCategory


class AllegationFilterTestCase(BaseLiveTestCase):
    def setUp(self):
        Allegation.objects.all().delete()
        AllegationCategory.objects.all().delete()
        self.allegation_category = AllegationCategoryFactory()
        for filter in FILTERS:
            for final_finding in FILTERS[filter]:
                # Make sure it doesn't break the disciplined test
                AllegationFactory(final_finding=final_finding, cat=self.allegation_category,
                                  final_outcome_class='disciplined')

    def test_filter_by_final_finding(self):
        self.visit_home()
        self.browser.execute_script('jQuery("#hfc-cleanslate").hide();')

        # Check all
        self.link("Categories").click()
        self.until(lambda: self.link(self.allegation_category.category).click())
        self.until(lambda : self.element_exist('.complaint-row'))
        self.number_of_complaints().should.equal(number_of_all_created_complaints())

        # On each filter
        for filter_text in FILTERS:
            self.element_by_tagname_and_text('span', filter_text, parent=".filters").click()
            self.until(self.ajax_complete)
            number_of_final_findings = len(FILTERS[filter_text])
            self.number_of_complaints().should.equal(number_of_final_findings)

        self.element_by_tagname_and_text('span', 'Disciplined').click()
        self.until(self.ajax_complete)
        self.number_of_complaints().should.equal(Allegation.objects.filter(final_outcome_class='disciplined').count())

    def test_suggest_repeater(self):
        self.visit_home()
        self.browser.execute_script('jQuery("#hfc-cleanslate").hide();')

        self.find('#autocomplete').send_keys('rep')
        self.until(lambda: self.element_by_classname_and_text('ui-autocomplete-category', 'Repeater').should.be.ok)

    def test_filter_by_repeater(self):
        self.visit_home()
        self.browser.execute_script('jQuery("#hfc-cleanslate").hide();')

        self.find('#autocomplete').send_keys('rep')
        self.until(lambda: self.find('.autocomplete-officer__allegations_count__gt').click())
        self.until(lambda: self.find('.filter-name').should.be.ok)
        self.find('.filter-name').text.should.contain('Repeater')
        
    def number_of_complaints(self):
        return len(self.find_all('.complaint-row'))
