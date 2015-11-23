import os
from unittest import skipIf, skipUnless

from selenium import webdriver

from common.tests.core import BaseLiveTestCase, BaseMobileLiveTestCase


IS_MOBILE = os.environ.get('MOBILE') == '1'


class ActiveTabAssertationMixin(object):
    def assert_current_active_tab(self, expected_tab):
        active_tab = self.find('.chart-row li.active a')
        active_tab.text.should.equal(expected_tab)


@skipIf(IS_MOBILE, "Skip in mobile mode")
class ActiveTabTestCase(BaseLiveTestCase, ActiveTabAssertationMixin):
    def test_site_default_active_tab(self):
        self.visit_home()

        self.assert_current_active_tab('Outcomes')

        self.link('Categories').click()
        self.until_ajax_complete()

        self.browser.refresh()
        self.assert_current_active_tab('Categories')

        browser = webdriver.Firefox()
        browser.get(self.browser.current_url)
        browser.find_element_by_css_selector('.chart-row li.active a').text.should.equal('Categories')
        browser.quit()


class ActiveTabMobileTestCase(BaseMobileLiveTestCase, ActiveTabAssertationMixin):
    def test_site_default_active_tab(self):
        self.visit_home()
        self.assert_current_active_tab('Map')
