import os
from unittest import skipIf
from selenium import webdriver

from allegation.factories import AllegationFactory
from common.tests.core import BaseLiveTestCase


class EmbedModeTestCase(BaseLiveTestCase):
    def setUp(self):
        self.allegation = AllegationFactory()

        self.visit_home()
        self.click_active_tab('Outcomes')
        self.link('Embed Mode').click()
        self.until(lambda: self.link('Exit mode').is_displayed().should.be.true)
        self.element_exist(".embed-button.active").should.be.true

    def tearDown(self):
        if self.link('Exit mode').is_displayed():
            self.link("Exit mode").click()
        super(EmbedModeTestCase, self).tearDown()

    def test_exit_embed_mode(self):
        self.link('Exit mode').click()
        self.link('Exit mode').is_displayed().should.be.false

    def test_embed_codes(self):
        map_column_code = self.find('.map-column .embed-code input')
        map_column_code.should.be.ok
        map_column_code.get_attribute('value').should.contain('/embed/?page=map&query=&state=')

        tabs_column_code = self.find('.tabs-column .embed-code input')
        tabs_column_code.should.be.ok
        tabs_column_code.get_attribute('value').should.contain('/embed/?page=sunburst&query=&state=')
        self.link('Categories').click()
        tabs_column_code.get_attribute('value').should.contain('/embed/?page=summary&query=&state=')

        officer_list_code = self.find('#officer-cards .embed-code input')
        officer_list_code.should.be.ok
        officer_list_code.get_attribute('value').should.contain('/embed/?page=officers&query=')

        officer_block_code = self.find('#officer-cards .officer-block .checkmark')
        officer_block_code.should.be.ok
        officer_block_code.get_attribute('data-clipboard-text').should.contain('/embed/?page=officer-card&pk={officer_id}'.format(officer_id=self.allegation.officer_id))

    def test_can_not_change_filter_in_embed_mode(self):
        self.link('Exit mode').click()

        self.until(lambda: self.fill_in('.ui-autocomplete-input', self.allegation.officer.officer_first))

        self.find(".autocomplete-officer").click()
        len(self.find_all("#filter-tags .tag")).should.equal(1)

        self.link('Embed Mode').click()
        self.until(lambda: self.find("body").has_class("embedding"))
        self.browser.execute_script("jQuery(window).scrollTop(0)")

        self.find("#filter-tags .tag .remove").click()
        len(self.find_all("#filter-tags .tag")).should.equal(1)

    def test_embed_not_display_in_officer_page(self):
        self.link("Exit mode").click()
        self.find('#officer-cards .officer-block').click()
        self.until_ajax_complete()

        self.link('Embed Mode').is_displayed().should.be.false


class EmbedPageTestCase(BaseLiveTestCase):
    FIREFOX_ADDRESS_BAR_HEIGHT = 80

    def setUp(self):
        self.allegation = AllegationFactory()

    def tearDown(self):
        self.browser.set_window_size(1200, 1200)
        super(EmbedPageTestCase, self).tearDown()

    @classmethod
    def tearDownClass(cls):
        cls().visit_home()
        super(EmbedPageTestCase, cls).tearDownClass()

    def check_no_scroll(self):
        scrollBarPresent = self.browser.execute_script("return document.documentElement.scrollHeight > document.documentElement.clientHeight;")
        scrollBarPresent.should.be.false
        scrollBarPresent = self.browser.execute_script("return document.documentElement.scrollWidth > document.documentElement.clientWidth;")
        scrollBarPresent.should.be.false

    def test_map_embed_code(self):
        self.browser.set_window_size(923, 576 + self.FIREFOX_ADDRESS_BAR_HEIGHT)
        self.visit("/embed/?page=map&query=&state=%7B%7D")
        self.until_ajax_complete()
        self.check_no_scroll()

    def test_outcomes_embed_code(self):
        self.browser.set_window_size(923, 456 + self.FIREFOX_ADDRESS_BAR_HEIGHT)
        self.visit("/embed/?page=sunburst&query=&state=%7B%22name%22%3A%22Allegations%22%7D")
        self.until_ajax_complete()
        self.check_no_scroll()

    def test_categories_embed_code(self):
        self.browser.set_window_size(891, 331 + self.FIREFOX_ADDRESS_BAR_HEIGHT)
        self.visit("/embed/?page=summary&query=&state=%7B%22selectedCategories%22%3A%5B%5D%2C%22currentActive%22%3Afalse%7D")
        self.until_ajax_complete()
        self.check_no_scroll()

    def test_officer_list_embed_code(self):
        self.browser.set_window_size(1200, 186 + self.FIREFOX_ADDRESS_BAR_HEIGHT)
        self.visit("/embed/?page=officers&query=")
        self.until_ajax_complete()
        self.check_no_scroll()
