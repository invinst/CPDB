from common.models import AllegationCategory
from common.tests.core import *
from allegation.factories import AllegationFactory, AllegationCategoryFactory


class HomePageTestCase(BaseLiveTestCase):
    def setUp(self):
        self.allegation_category = AllegationCategoryFactory()
        self.allegation = AllegationFactory(cat=self.allegation_category)

    def test_click_on_category_only_show_allegation_belong_to_it(self):
        other_category = AllegationCategoryFactory()
        other_allegation = AllegationFactory(cat=other_category)
        self.visit('/')
        self.link("Complaint Types").click()
        self.number_of_officers().should.equal(2)

        self.link(self.allegation_category.category).click()

        self.number_of_officers().should.equal(1)

    def test_click_on_officer_will_show_compliant(self):
        self.visit('/')
        self.link("Complaint Types").click()

        self.number_of_officers().should.equal(1)

        self.find('.checkmark').click()
        self.until(lambda: self.element_exist('.complaint_list'))
        self.find('.complaint-row > .row').click()

        self.element_exist('.complaint_detail').should.equal(True)

    def test_all_subcategories_should_be_selected(self):
        category = self.allegation_category.category
        for i in range(0, 10):
            AllegationCategoryFactory(category=category)

        # First, we click a category, we should see the arrow beside the category
        self.visit('/')
        self.link("Complaint Types").click()
        self.element_exist('.row .arrow-container').should.equal(False)
        self.link(self.allegation_category.category).click()
        # TODO: We should have another test to check which main category this arrow belong to?
        self.element_exist('.row .arrow-container').should.equal(True)

        # And it should have a an arrow on the category
        self.number_of_active_subcategories().should.equal(AllegationCategory.objects.filter(category=category).count())

        self.link(self.allegation_category.allegation_name).click()
        self.number_of_active_subcategories().should.equal(1)

    def number_of_active_subcategories(self):
        active_subcategories = self.find_all('.child-rows .category-name.active')
        return len(active_subcategories)

    def number_of_officers(self):
        officers = self.find_all('.officer')
        return len(officers)
