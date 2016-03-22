from selenium import webdriver
from selenium.webdriver.firefox.webdriver import WebDriver
import re

from allegation.factories import (
    OfficerAllegationFactory, AllegationCategoryFactory)
from allegation.tests.utils.autocomplete_test_helper_mixin import AutocompleteTestHelperMixin
from common.tests.core import BaseLiveTestCase, retry_random_fail, switch_to_popup
from common.utils.haystack import rebuild_index
from share.models import Session


class HomePageTestCase(AutocompleteTestHelperMixin, BaseLiveTestCase):
    def setUp(self):
        self.allegation_category = AllegationCategoryFactory()
        self.officer_allegation = OfficerAllegationFactory(
            cat=self.allegation_category, final_finding='NS')

    def tearDown(self):
        super(HomePageTestCase, self).tearDown()
        self.allegation_category.delete()
        if self.officer_allegation.officer:
            self.officer_allegation.officer.delete()
        else:
            self.officer_allegation.delete()

    def test_start_new_session_on_click_logo(self):
        Session.objects.all().count().should.equal(0)
        self.visit_home(fresh=True)
        self.link("Categories").click()
        self.find(".category-name-wrapper a").click()
        self.until_ajax_complete()
        Session.objects.all().count().should.equal(1)

        url = self.browser.current_url
        self.find("#logo_link img").click()
        self.until(lambda: self.browser.current_url != url)

        Session.objects.all().count().should.equal(2)
        session = Session.objects.all()[1]
        self.browser.current_url.should.contain(session.hash_id)

    def test_see_tabs(self):
        self.visit_home()
        links = self.find_all('.chart-row .nav a')
        link_texts = [x.text for x in links]
        link_texts.should.contain('Outcomes')
        link_texts.should.contain('Categories')
        link_texts.should.contain('Race & Gender')

    def test_close_disclaimer(self):
        self.visit_home()
        self.link('About the data').click()
        self.until(lambda: self.button('I UNDERSTAND').click())
        self.until(lambda: self.should_not_see_text('I UNDERSTAND'))

    def test_see_session_query_on_reload(self):
        self.visit_home()
        officer = self.officer_allegation.officer

        rebuild_index()

        self.until(
            lambda:
            self.fill_in('.ui-autocomplete-input', officer.officer_first))
        self.until_ajax_complete()
        self.until(lambda: self.find(".autocomplete-officer").is_displayed())
        self.find(".autocomplete-officer").click()

        self.should_see_text(officer.officer_first)
        self.should_see_text(officer.officer_last)

        self.browser.refresh()
        self.until(self.ajax_complete)
        self.until(lambda: self.should_see_text(officer.officer_first))
        self.should_see_text(officer.officer_last)

    def test_complaint_detail_without_investigator(self):
        self.officer_allegation.investigator = None
        self.officer_allegation.save()

        self.visit_home()
        self.link('Categories').click()
        self.find('.category-name').click()
        self.find('.complaint-row .cursor').click()
        officers_divs = self.find_all('.officers > div')

        len(officers_divs).should.equal(1)
        officers_divs[0].has_class('col-md-10')

    def click_sunburst_legend(self, text):
        self.element_by_tagname_and_text('td', text).click()
        self.sleep(0.75)
        self.until(
            lambda:
            self.element_by_classname_and_text('filter-name', text)
                .should.be.ok)

    def test_sunburst(self):
        us = 'Unsustained'
        ns = 'Not Sustained'

        self.visit_home()
        self.click_active_tab("Outcomes")
        with self.browser_no_wait():
            self.element_by_classname_and_text('filter-name', us)\
                .shouldnt.be.ok
            self.element_by_classname_and_text('filter-name', ns)\
                .shouldnt.be.ok

        self.click_sunburst_legend(us)

        with self.browser_no_wait():
            self.element_by_classname_and_text('filter-name', ns)\
                .shouldnt.be.ok

        sunburst_legend_root_text = self.find('#sunburst-legend .root').text
        url = self.browser.current_url
        with self.open_new_browser():
            self.visit(url)

            self.until_ajax_complete()
            self.sleep(0.75)  # sunburst zoom time

            with self.browser_no_wait():  # same state with above
                self.find('#sunburst-legend .root')\
                    .text.should.equal(sunburst_legend_root_text)

        self.click_sunburst_legend(ns)
        with self.browser_no_wait():
            self.element_by_classname_and_text(
                'filter-name', us).shouldnt.be.ok

        self.click_sunburst_legend(us)
        with self.browser_no_wait():
            self.element_by_classname_and_text(
                'filter-name', ns).shouldnt.be.ok

        self.find(".tag .remove").click()
        with self.browser_no_wait():
            self.element_by_tagname_and_text('td', ns).shouldnt.be.ok

    def test_sunburst_remove_tag(self):
        us = 'Unsustained'
        ns = 'Not Sustained'

        self.officer_allegation = OfficerAllegationFactory(
            cat=self.allegation_category, final_outcome='300')
        self.visit_home()
        self.click_active_tab("Outcomes")

        self.until(lambda: self.should_see_text('Officers (2)'))

        self.click_sunburst_legend(us)
        self.click_sunburst_legend(ns)
        self.until(lambda: self.element_by_classname_and_text('filter-name', ns))

        self.find(".tag .remove").click()
        self.until(lambda: self.element_by_classname_and_text('filter-name', us))
        self.should_see_text('Officers (1)')

    def test_replace_old_filter_in_same_category(self):
        officer_allegation = OfficerAllegationFactory()

        rebuild_index()

        self.visit_home()
        self.search_officer(officer_allegation.officer)
        self.should_see_text(officer_allegation.officer.display_name)

        self.search_officer(self.officer_allegation.officer)
        self.should_see_text(self.officer_allegation.officer.display_name)
        self.should_not_see_text(officer_allegation.officer.display_name)

    @retry_random_fail
    def test_pin_tag(self):
        officer_allegation = OfficerAllegationFactory()
        another = OfficerAllegationFactory()

        rebuild_index()

        self.visit_home()
        self.search_officer(officer_allegation.officer)
        self.should_see_text(officer_allegation.officer.display_name)

        self.find('.tag > .pin').click()
        self.until(
            lambda:
            self.find('.tag').get_attribute('class').should.contain('pinned'))

        self.search_officer(self.officer_allegation.officer)
        self.should_see_text(self.officer_allegation.officer.display_name)
        self.should_see_text(officer_allegation.officer.display_name)

        self.search_officer(another.officer)
        self.should_see_text(another.officer.display_name)
        self.should_see_text(officer_allegation.officer.display_name)
        self.should_not_see_text(self.officer_allegation.officer.display_name)

    def test_unpin_tag(self):
        officer_allegation = OfficerAllegationFactory()
        another = OfficerAllegationFactory()

        rebuild_index()

        self.visit_home()
        self.search_officer(officer_allegation.officer)
        self.should_see_text(officer_allegation.officer.display_name)

        self.find('.tag > .pin').click()
        self.search_officer(self.officer_allegation.officer)
        self.should_see_text(self.officer_allegation.officer.display_name)
        self.should_see_text(officer_allegation.officer.display_name)

        element = self.find('.pinned')
        element.find('.pin').click()
        self.until(
            lambda: element.get_attribute('class').shouldnt.contain('pinned'))

        self.search_officer(another.officer)
        self.should_see_text(another.officer.display_name)
        self.should_not_see_text(officer_allegation.officer.display_name)
        self.should_not_see_text(self.officer_allegation.officer.display_name)

    def test_default_site_title_from_settings(self):
        setting = self.get_admin_settings()
        setting.default_site_title = 'New title'
        setting.save()

        self.visit_home(fresh=True)
        self.browser.title.should.equal(setting.default_site_title)

    def test_share_button(self):
        self.visit_home(fresh=True)
        self.find('.share-button button').click()
        self.find('.share-bar').is_displayed()
        self.find('.share-bar-content-wrapper input').get_attribute('value').should_not.equal(self.browser.current_url)
        self.find('.share-button button').click()
        with self.browser_no_wait():
            self.element_exist('.share-bar').should.be.false

    def test_no_disclaimer_when_search_engine(self):
        profile = webdriver.FirefoxProfile()
        profile.set_preference(
            "general.useragent.override",
            "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
        )
        browser = WebDriver(profile)
        browser.implicitly_wait(10)
        browser.set_window_size(width=1200, height=1200)

        old_browser = self.browser

        self.set_browser(browser)
        self.visit_home()
        self.find('#disclaimer').get_attribute('class').should.contain('fade')

        self.set_browser(old_browser)

    def test_share_bar_facebook_share(self):
        title = 'Donald Duck'

        self.visit_home()
        self.find('.share-button button').click()
        self.until_ajax_complete()
        self.fill_in('.site-title-input', title)
        shared_hash_id = re.findall(
            r'data/([^/]+)', self.find('.share-bar-content-wrapper input').get_attribute('value'))[0]
        self.find('.share-bar-facebook-link').click()
        self.until_ajax_complete()

        with switch_to_popup(self.browser):
            ('https://www.facebook.com' in self.browser.current_url).should.be.true

        self.find('.share-button button').click()

        session_id = Session.id_from_hash(shared_hash_id)[0]
        session = Session.objects.get(id=session_id)
        session.title.should.be.equal(title)

    def test_responsive_layout(self):
        profile = webdriver.FirefoxProfile()
        profile.set_preference(
            "general.useragent.override",
            "Mozilla/5.0 (iPad; CPU OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko ) Version/5.1 Mobile/9B176 Safari/7534.48.3"  # noqa
        )
        driver = webdriver.Firefox(profile)

        old_browser = self.browser
        self.set_browser(driver)
        self.browser.set_window_size(width=1040, height=1200)  # 1024 + 16px for scroll bar, apparently?

        self.visit_home()

        len(self.find_all('.nav-tabs li')).should.equal(3)
        self.find('#sunburst-chart svg').get_attribute('width').should.be.greater_than('249')

        self.browser.set_window_size(width=1024, height=1200)
        self.visit_home()
        len(self.find_all('.nav-tabs li')).should.equal(4)
        driver.close()
        self.set_browser(old_browser)
        self.browser.set_window_size(width=1200, height=1000)
