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

    def test_update_officer(self):
        officer = self.officer
        self.go_to_officer_profile()
        self.find("#search-officer input").send_keys(officer.officer_first)

        self.find(".officer").click()
        self.should_see_text('Edit information')
        self.should_see_text('Add story')
        self.should_see_text(str(officer))

        self.browser.refresh()
        self.until(lambda: self.should_see_text(officer.officer_last))

        self.element_by_tagname_and_text('li', 'Edit information').click()
        self.button("Save").should.be.ok

        random_string = "abc"
        self.element_for_label("Last name").send_keys(random_string)
        self.button("Save").click()
        self.until(self.ajax_complete)

        self.should_see_text("Officer profile has been updated.")
        officer_data = Officer.objects.get(id=officer.id)
        officer_data.officer_last.should.contain(random_string)

    def test_add_officer_story(self):
        officer = self.officer
        self.go_to_officer_profile()
        self.find("#search-officer input").send_keys(officer.officer_first)

        self.find(".officer").click()
        self.element_for_label('Title').send_keys("Title")
        self.element_for_label('Slug').send_keys("Slug")
        self.element_for_label('Short Description').send_keys("Short Description")
        self.element_for_label('Content').send_keys("Content")

        self.button("Save").click()
        self.until(self.ajax_complete)

        self.should_see_text('New story has been created.')
        new_row = self.find(".story").text
        new_row.should.contain("Title")

        self.element_for_label('Title').send_keys("2")
        self.button("Save").click()
        self.until(self.ajax_complete)

        self.should_see_text('Story has been updated.')
        self.until(self.ajax_complete)

        new_row = self.find(".story").text
        new_row.should.contain("Title2")

        self.browser.refresh()
        self.until(lambda: self.find(".story").should.be.ok)
        new_row.should.contain("Title2")

        self.find(".story .fa-pencil").click()
        self.element_for_label('Title').get_attribute('value').should.equal("Title2")
        self.element_for_label('Slug').get_attribute('value').should.equal("Slug")
        self.element_for_label('Short Description').get_attribute('value').should.equal("Short Description")
        self.element_for_label('Content').get_attribute('value').should.equal("Content")
