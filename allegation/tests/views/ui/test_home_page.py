from common.models import AllegationCategory
from common.tests.core import *
from allegation.factories import AllegationFactory, AllegationCategoryFactory


class HomePageTestCase(BaseLiveTestCase):
    def setUp(self):
        self.allegation_category = AllegationCategoryFactory()
        self.allegation = AllegationFactory(cat=self.allegation_category)

    def tearDown(self):
        super(HomePageTestCase, self).tearDown()
        self.allegation_category.delete()

    def test_see_tabs(self):
        self.visit('/#!/data-tools')
        links = self.find_all('.chart-row .nav a')
        link_texts = [x.text for x in links]
        link_texts.should.contain('Outcomes')
        link_texts.should.contain('Categories')
        link_texts.should.contain('Race & Gender')
        link_texts.should.contain('Timeframe')

    def filter_complaint_type(self):
        self.visit('/#!/data-tools')
        self.link("Categories").click()

    def test_click_on_category_only_show_allegation_belong_to_it(self):
        other_category = AllegationCategoryFactory()
        other_allegation = AllegationFactory(cat=other_category)

        self.filter_complaint_type()
        self.number_of_officers().should.equal(2)

        self.link(self.allegation_category.category).click()

        self.number_of_officers().should.equal(1)

    def test_click_on_officer_will_show_compliant(self):
        self.filter_complaint_type()

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
        self.filter_complaint_type()
        self.element_exist('.row .arrow-container').should.equal(False)
        self.link(self.allegation_category.category).click()
        # TODO: We should have another test to check which main category this arrow belong to?
        self.element_exist('.row .arrow-container').should.equal(True)

        # And it should have a an arrow on the category
        self.number_of_active_subcategories().should.equal(AllegationCategory.objects.filter(category=category).count())
        self.link(self.allegation_category.allegation_name).click()
        self.until(lambda: self.number_of_active_subcategories().should.equal(1))

    def number_of_active_subcategories(self):
        active_subcategories = self.find_all('.child-rows .category-name.active')
        return len(active_subcategories)

    def number_of_officers(self):
        officers = self.find_all('.officer')
        return len(officers)

    def test_show_disclaimer(self):
        self.visit('/')
        self.button('View Database').click()
        self.link('About the data').click()
        self.until(lambda: self.should_see_text('I UNDERSTAND'))

    def test_close_disclaimer(self):
        self.visit('/')
        self.button('View Database').click()
        self.link('About the data').click()
        self.until(lambda: self.button('I UNDERSTAND').click())
        self.until(lambda: self.should_not_see_text('I UNDERSTAND'))
