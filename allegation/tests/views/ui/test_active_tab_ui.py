from common.tests.core import BaseLiveTestCase, BaseMobileLiveTestCase


class ActiveTabTestCase(BaseLiveTestCase):
    def setUp(self):
        pass

    def assertCurrentActiveTab(self, expected_tab):
        active_tab = self.find('.chart-row li.active a')
        active_tab.text.should.equal(expected_tab)

    def test_site_default_active_tab(self):
        self.visit('/#!/data-tools')

        self.assertCurrentActiveTab('Outcomes')

        self.link('Categories').click()
        self.browser.refresh()

        self.assertCurrentActiveTab('Categories')


class ActiveTabMobileTestCase(BaseMobileLiveTestCase):
    def test_site_default_active_tab(self):
        self.visit('/#!/data-tools')
        self.assertCurrentActiveTab('Map')