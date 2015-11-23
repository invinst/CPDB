from selenium.webdriver.common.keys import Keys

from api.models import Setting
from common.tests.core import *
from allegation.factories import AllegationFactory, AllegationCategoryFactory


class HomePageTestCase(BaseLiveTestCase):
    def setUp(self):
        self.allegation_category = AllegationCategoryFactory()
        self.allegation = AllegationFactory(cat=self.allegation_category)

    def tearDown(self):
        super(HomePageTestCase, self).tearDown()
        self.allegation_category.delete()
        if self.allegation.officer:
            self.allegation.officer.delete()
        else:
            self.allegation.delete()

    def test_see_tabs(self):
        self.visit_home()
        links = self.find_all('.chart-row .nav a')
        link_texts = [x.text for x in links]
        link_texts.should.contain('Outcomes')
        link_texts.should.contain('Categories')
        link_texts.should.contain('Race & Gender')

    def filter_complaint_type(self):
        self.visit_home()
        self.link("Categories").click()

    def check_number_officer(self, num):
        self.until(lambda: self.number_of_officers().should.equal(num))

    def test_click_on_category_only_show_allegation_belong_to_it(self):
        other_category = AllegationCategoryFactory()
        other_allegation = AllegationFactory(cat=other_category)
        self.filter_complaint_type()

        self.check_number_officer(2)

        self.until(lambda: self.link(self.allegation_category.category).is_displayed())
        self.link(self.allegation_category.category).click()

        self.check_number_officer(1)

    def test_click_on_officer_will_show_compliant(self):
        self.filter_complaint_type()

        self.check_number_officer(1)

        self.find('.checkmark').click()
        self.until(lambda: self.element_exist('.complaint_list'))
        self.find('.complaint-row > .row').click()

        self.element_exist('.complaint_detail').should.equal(True)

    def test_all_subcategories_should_be_selected(self):
        category = self.allegation_category.category
        AllegationCategoryFactory(category=category)

        # First, we click a category, we should see the arrow beside the category
        self.filter_complaint_type()
        self.browser.implicitly_wait(0)
        self.element_exist('.row .arrow-container').should.equal(False)
        self.browser.implicitly_wait(10)
        self.until(lambda: self.link(self.allegation_category.category).click())
        # TODO: We should have another test to check which main category this arrow belong to?
        self.element_exist('.row .arrow-container').should.equal(True)

        # And it should have a an arrow on the category
        self.until(lambda: self.number_of_active_subcategories().should.equal(2))
        self.until(lambda: self.should_see_text(self.allegation_category.allegation_name))
        self.link(self.allegation_category.allegation_name).click()
        self.until(lambda: self.number_of_active_subcategories().should.equal(1))

    def number_of_active_subcategories(self):
        active_subcategories = self.find_all('.child-rows .category-name.active')
        return len(active_subcategories)

    def number_of_officers(self):
        officers = self.find_all('.officer')
        return len(officers)

    def test_close_disclaimer(self):
        self.visit_home()
        self.link('About the data').click()
        self.until(lambda: self.button('I UNDERSTAND').click())
        self.until(lambda: self.should_not_see_text('I UNDERSTAND'))

    def test_see_session_query_on_reload(self):
        self.visit_home()
        officer = self.allegation.officer

        self.until(lambda: self.find('.ui-autocomplete-input').send_keys(officer.officer_first))
        self.find(".autocomplete-officer").click()
        self.should_see_text(officer.officer_first)
        self.should_see_text(officer.officer_last)

        self.browser.refresh()
        self.until(self.ajax_complete)
        self.until(lambda: self.should_see_text(officer.officer_first))
        self.should_see_text(officer.officer_last)

    def test_complaint_detail_with_investigator_0_officer(self):
        self.allegation.officer = None
        self.allegation.save()

        self.visit_home()
        self.link('Categories').click()
        self.find('.category-name').click()
        self.check_complaint_detail_with_n_officers('hidden')

    def test_complaint_detail_with_investigator_1_officer(self):
        self.open_complaint_detail_with_class()
        self.check_complaint_detail_with_n_officers('col-md-2')

    def test_complaint_detail_with_investigator_2_officer(self):
        AllegationFactory.create_batch(1, crid=self.allegation.crid, investigator=self.allegation.investigator)
        self.open_complaint_detail_with_class()
        self.check_complaint_detail_with_n_officers('col-md-4')

    def test_complaint_detail_with_investigator_3_officer(self):
        AllegationFactory.create_batch(2, crid=self.allegation.crid, investigator=self.allegation.investigator)
        self.open_complaint_detail_with_class()
        self.check_complaint_detail_with_n_officers('col-md-6')

    def test_complaint_detail_with_investigator_more_than_3_officers(self):
        AllegationFactory.create_batch(3, crid=self.allegation.crid, investigator=self.allegation.investigator)
        self.open_complaint_detail_with_class()
        self.check_complaint_detail_with_n_officers('col-md-6')

    def open_complaint_detail_with_class(self):
        self.visit_home()
        self.find('.checkmark').click()

    def check_complaint_detail_with_n_officers(self, class_name):
        self.find('.complaint-row .cursor').click()
        officers_divs = self.find_all('.officers > div')
        officers_divs[0].has_class(class_name).should.be.true
        officers_divs[1].has_class('col-md-4').should.be.true

    def test_complaint_detail_without_investigator(self):
        self.allegation.investigator = None
        self.allegation.save()

        self.visit_home()
        self.link('Categories').click()
        self.find('.category-name').click()
        self.find('.complaint-row .cursor').click()
        officers_divs = self.find_all('.officers > div')

        len(officers_divs).should.equal(1)
        officers_divs[0].has_class('col-md-10')

    def test_sunburst(self):
        us = 'Unsustained'
        ns = 'Not Sustained'
        AllegationFactory(final_finding='NS')

        self.visit_home()
        self.link("Outcomes").click()
        self.browser.implicitly_wait(0)
        self.element_by_classname_and_text('filter-name', us).shouldnt.be.ok
        self.element_by_classname_and_text('filter-name', ns).shouldnt.be.ok
        self.browser.implicitly_wait(10)

        self.element_by_tagname_and_text('td', us).click()
        self.until(lambda: self.element_by_classname_and_text('filter-name', us).should.be.ok)
        self.browser.implicitly_wait(0)
        self.element_by_classname_and_text('filter-name', ns).shouldnt.be.ok
        self.browser.implicitly_wait(10)

        self.element_by_tagname_and_text('td', ns).click()
        self.until(lambda: self.element_by_classname_and_text('filter-name', ns).should.be.ok)
        self.browser.implicitly_wait(0)
        self.element_by_classname_and_text('filter-name', us).shouldnt.be.ok
        self.browser.implicitly_wait(10)

        self.element_by_tagname_and_text('td', us).click()
        self.until(lambda: self.element_by_classname_and_text('filter-name', us).should.be.ok)
        self.browser.implicitly_wait(0)
        self.element_by_classname_and_text('filter-name', ns).shouldnt.be.ok
        self.browser.implicitly_wait(10)

        self.find(".tag .remove").click()
        self.browser.implicitly_wait(0)
        self.element_by_tagname_and_text('td', ns).shouldnt.be.ok
        self.browser.implicitly_wait(10)

    def test_sticky_footer(self):
        officer = self.allegation.officer
        AllegationFactory.create_batch(40, officer=officer)
        self.browser.set_window_size(width=1200, height=800)
        self.open_complaint_detail_with_class()
        self.until_ajax_complete()

        self.is_displayed_in_viewport('.sticky-footer').should.be.false

        self.browser.execute_script("jQuery(window).scrollTop(jQuery('#complaint-list').offset().top + 100);")
        self.until(lambda: self.is_displayed_in_viewport('.sticky-footer').should.be.true)
        self.find('body').send_keys(Keys.PAGE_UP)
        self.until(lambda: self.is_displayed_in_viewport('.sticky-footer').should.be.false)

    def test_replace_old_filter_in_same_category(self):
        allegation = AllegationFactory()
        self.visit_home()
        self.search_officer(allegation.officer)
        self.should_see_text(allegation.officer.display_name)

        self.search_officer(self.allegation.officer)
        self.should_see_text(self.allegation.officer.display_name)
        self.should_not_see_text(allegation.officer.display_name)

    def test_pin_tag(self):
        allegation = AllegationFactory()
        self.visit_home()
        self.search_officer(allegation.officer)
        self.should_see_text(allegation.officer.display_name)

        self.find('.tag > .pin').click()
        self.until(lambda: self.find('.tag').get_attribute('class').should.contain('pinned'))

        self.search_officer(self.allegation.officer)
        self.should_see_text(self.allegation.officer.display_name)
        self.should_see_text(allegation.officer.display_name)

        another = AllegationFactory()
        self.search_officer(another.officer)
        self.should_see_text(another.officer.display_name)
        self.should_see_text(allegation.officer.display_name)
        self.should_not_see_text(self.allegation.officer.display_name)

    def test_unpin_tag(self):
        allegation = AllegationFactory()
        self.visit_home()
        self.search_officer(allegation.officer)
        self.should_see_text(allegation.officer.display_name)

        self.find('.tag > .pin').click()
        self.search_officer(self.allegation.officer)
        self.should_see_text(self.allegation.officer.display_name)
        self.should_see_text(allegation.officer.display_name)

        element = self.find('.pinned')
        element.find('.pin').click()
        self.until(lambda: element.get_attribute('class').shouldnt.contain('pinned'))

        another = AllegationFactory()
        self.search_officer(another.officer)
        self.should_see_text(another.officer.display_name)
        self.should_not_see_text(allegation.officer.display_name)
        self.should_not_see_text(self.allegation.officer.display_name)

    def autocomplete_available(self, text):
        items = self.find_all(".ui-autocomplete .ui-menu-item")
        items = [x.text for x in items]
        return any(text in x for x in items)

    def autocomplete_select(self, text):
        items = self.find_all(".ui-autocomplete .ui-menu-item")
        for item in items:
            if text in item.text:
                item.click()

    def search_officer(self, officer):
        self.fill_in("#autocomplete", officer.officer_first)
        self.until_ajax_complete()
        self.until(lambda: self.autocomplete_available(officer.display_name))
        self.autocomplete_select(officer.display_name)
        self.until_ajax_complete()

    def test_default_site_title_from_settings(self):
        setting, _ = Setting.objects.get_or_create(key='DEFAULT_SITE_TITLE')
        setting.value = 'New title'
        setting.save()

        self.visit_home()
        self.browser.title.should.equal(setting.value)
