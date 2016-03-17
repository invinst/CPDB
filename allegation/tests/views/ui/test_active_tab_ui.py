from selenium import webdriver

from common.tests.core import BaseLiveTestCase, BaseMobileLiveTestCase


class ActiveTabAssertationMixin(object):
    def assert_current_active_tab(self, expected_tab):
        active_tab = self.find('.chart-row li.active a')
        active_tab.text.should.equal(expected_tab)


class ActiveTabTestCase(BaseLiveTestCase, ActiveTabAssertationMixin):
    def test_site_default_active_tab(self):
        self.visit_home()

        self.assert_current_active_tab('Outcomes')

        self.link('Categories').click()
        self.until_ajax_complete()

        self.browser.refresh()
        self.assert_current_active_tab('Categories')

        try:
            browser = webdriver.Firefox()
            browser.set_window_size(**self.DESKTOP_BROWSER_SIZE)
            browser.get(self.browser.current_url)
            self.until(lambda: browser.find_element_by_css_selector('.chart-row li.active a'))
            browser.find_element_by_css_selector('.chart-row li.active a').text.should.equal('Categories')
        finally:
            browser.close()


class ActiveTabMobileTestCase(BaseMobileLiveTestCase, ActiveTabAssertationMixin):
    def test_site_default_active_tab(self):
        self.browser.set_window_size(640, 1000)
        self.visit_home()
        self.assert_current_active_tab('Map')
