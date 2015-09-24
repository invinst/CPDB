from allegation.factories import OfficerFactory
from common.models import Officer
from common.tests.core import BaseLiveTestCase


class SearchResultTestCase(BaseLiveTestCase):
    def setUp(self):
        self.login_user()
        self.visit('/admin/')
        self.officer = OfficerFactory()

    def tearDown(self):
        Officer.objects.all().delete()
        super(SearchResultTestCase, self).tearDown()

    def go_to_officer_profile(self):
        self.element_by_tagname_and_text('span', 'Officer Profiles').click()

    def test_see_officer_tab(self):
        self.should_see_text('Officer Profiles')
        self.go_to_officer_profile()
        self.find("h1").text.should.equal('Officer Profile')
        self.should_see_text('Please search officer to start adding stories')
        self.find("#search-officer input").should.be.ok

    def test_search_officer(self):
        officer = self.officer
        self.go_to_officer_profile()
        self.find("#search-officer input").send_keys(officer.officer_first)

        self.until(lambda: self.should_see_text(officer.officer_last))
        self.should_see_text(officer.id)
        self.should_see_text(officer.gender)
        self.should_see_text(officer.race)

        self.browser.refresh()
        self.until(lambda: self.should_see_text(officer.officer_last))

    def test_update_officer(self):
        officer = self.officer
        self.go_to_officer_profile()
        self.find("#search-officer input").send_keys(officer.officer_first)

        self.find(".officer").click()
        self.should_see_text(str(officer))
        self.button("Save").should.be.ok

        random_string = "abc"
        self.element_for_label("Last name").send_keys(random_string)
        self.button("Save").click()
        self.until(self.ajax_complete)

        self.should_see_text("Officer profile has been updated.")
        officer_data = Officer.objects.get(id=officer.id)
        officer_data.officer_last.should.contain(random_string)
