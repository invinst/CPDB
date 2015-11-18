import os
from unittest import skipIf, skipUnless

from common.tests.core import BaseLiveTestCase, BaseMobileLiveTestCase


IS_MOBILE = os.environ.get('MOBILE') == '1'


class ActiveTabAssertationMixin(object):
    def assert_current_active_tab(self, expected_tab):
        active_tab = self.find('.chart-row li.active a')
        active_tab.text.should.equal(expected_tab)


@skipIf(IS_MOBILE, "Skip in mobile mode")
class ActiveTabTestCase(BaseLiveTestCase, ActiveTabAssertationMixin):
    def test_site_default_active_tab(self):
        self.visit('/#!/data-tools')

        self.assert_current_active_tab('Outcomes')

        self.link('Categories').click()
        self.browser.refresh()

        self.assert_current_active_tab('Categories')


class ActiveTabMobileTestCase(BaseMobileLiveTestCase, ActiveTabAssertationMixin):
    def test_site_default_active_tab(self):
        self.visit('/#!/data-tools')
        self.assert_current_active_tab('Map')
