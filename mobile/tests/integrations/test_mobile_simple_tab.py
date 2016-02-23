from allegation.factories import OfficerFactory
from common.tests.core import BaseLivePhoneTestCase


class MobileSimpleTabTestMixin(object):
    def assert_active_tab(self, tab_class):
        tab_selector = '.tab-nav.active.{tab_class}'.format(tab_class=tab_class)
        self.find(tab_selector).should.be.ok

    def change_tab(self, tab_class):
        self.find(tab_class).click()


class MobileSimpleTabTest(MobileSimpleTabTestMixin, BaseLivePhoneTestCase):
    # TODO: This is not a good test, since we need to test the `SimpleTab`, not the officer tab, but we will accept it
    # until we have a good Javascript test
    def test_go_to_officer_page_with_tab(self):
        officer = OfficerFactory()

        self.visit_officer_page_tab(officer.id, 'complaints')

        self.assert_active_tab('tab-complaints')

    def test_change_tab_should_change_url(self):
        officer = OfficerFactory()

        self.visit_officer_page(officer.id)
        self.change_tab('.tab-complaints')

        self.browser.current_url.should.contain('#complaints')
