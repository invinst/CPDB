from allegation.factories import OfficerFactory
from common.models import Officer
from common.tests.core import BaseLiveTestCase
from officer.factories import StoryFactory


class OfficerProfileTestCase(BaseLiveTestCase):
    def setUp(self):
        self.login_user()
        self.visit('/admin/')

    def go_to_officer_profile(self):
        self.element_by_tagname_and_text('span', 'Investigation Documents').click()

    def tab_should_active(self, text):
        self.element_by_tagname_and_text('li', text).has_class('active').should.be.true

    def test_see_document_request_tab(self):
        self.should_see_text('Investigation Documents')
        self.go_to_officer_profile()
        self.find("h1").text.should.equal('Investigation Documents')
        self.button("Add document").should.be.ok

        tabs = ["All", "Missing", "Requesting", "Fulfilled"]
        for tab in tabs:
            self.should_see_text(tab)

        self.tab_should_active("All")

        for tab in tabs:
            self.element_by_tagname_and_text('li', tab).click()
            self.tab_should_active(tab)
