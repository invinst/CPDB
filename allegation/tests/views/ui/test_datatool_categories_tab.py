from common.tests.core import BaseLiveTestCase
from allegation.factories import (
    OfficerAllegationFactory, AllegationCategoryFactory)


class DataToolCategoriesTabTestCase(BaseLiveTestCase):
    def setUp(self):
        self.allegation_category = AllegationCategoryFactory()
        self.officer_allegation = OfficerAllegationFactory(
            cat=self.allegation_category, final_finding='NS')

    def tearDown(self):
        super(DataToolCategoriesTabTestCase, self).tearDown()
        self.allegation_category.delete()
        if self.officer_allegation.officer:
            self.officer_allegation.officer.delete()
        else:
            self.officer_allegation.delete()

    # Helper methods
    def filter_complaint_type(self):
        self.visit_home()
        self.link("Categories").click()
        self.until_ajax_complete()

    def check_number_officer(self, num):
        self.until(lambda: self.number_of_officers().should.equal(num))

    def number_of_active_subcategories(self):
        active_subcategories = self.find_all(
            '.child-rows .category-name.active')
        return len(active_subcategories)

    def number_of_officers(self):
        officers = self.find_all('.officer')
        return len(officers)

    # Tests
    def test_click_on_category_only_show_allegation_belong_to_it(self):
        other_category = AllegationCategoryFactory()
        OfficerAllegationFactory(cat=other_category)
        self.filter_complaint_type()

        self.check_number_officer(2)

        self.until(
            lambda:
            self.link(self.allegation_category.category).is_displayed())
        self.link(self.allegation_category.category).click()

        self.check_number_officer(1)

    def test_click_on_officer_will_show_compliant(self):
        self.filter_complaint_type()

        self.check_number_officer(1)

        self.browser.refresh()

        self.find('.checkmark').click()
        self.until(lambda: self.element_exist('.complaint-list'))
        self.find('.complaint-row > .row').click()

        self.element_exist('.complaint_detail').should.equal(True)

    def test_all_subcategories_should_be_selected(self):
        category = self.allegation_category.category
        allegation_category = AllegationCategoryFactory(category=category)
        OfficerAllegationFactory(cat=allegation_category)

        # First, we click a category, we should see the arrow beside the category
        self.filter_complaint_type()
        with self.browser_no_wait():
            self.element_exist('.row .arrow-container').should.equal(False)

        self.until(
            lambda: self.link(self.allegation_category.category).click())
        # TODO: We should have another test to check which main category this arrow belong to?
        self.element_exist('.row .arrow-container').should.equal(True)

        # And it should have a an arrow on the category
        self.until(
            lambda: self.number_of_active_subcategories().should.equal(2))
        self.until(
            lambda:
            self.should_see_text(self.allegation_category.allegation_name))
        self.link(self.allegation_category.allegation_name).click()
        self.until(
            lambda: self.number_of_active_subcategories().should.equal(1))

    def test_categories_replacement_logic(self):
        category = self.allegation_category.category
        other_category = AllegationCategoryFactory()
        sub_category = AllegationCategoryFactory(category=category)
        OfficerAllegationFactory(cat=other_category)
        OfficerAllegationFactory(cat=sub_category)

        self.filter_complaint_type()
        self.link(category).click()
        self.until_ajax_complete()
        self.element_by_classname_and_text('filter-name', category).should.be.ok

        self.link(sub_category.allegation_name).click()
        self.until_ajax_complete()
        self.element_by_classname_and_text('filter-name', sub_category.allegation_name).should.be.ok
        self.element_by_classname_and_text('filter-name', category).should.be.false

        self.link(other_category.category).click()
        self.until_ajax_complete()
        self.element_by_classname_and_text('filter-name', other_category.category).should.be.ok
        self.element_by_classname_and_text('filter-name', sub_category.allegation_name).should.be.false
