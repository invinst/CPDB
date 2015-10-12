from allegation.factories import OfficerFactory
from common.models import Officer
from common.tests.core import BaseLiveTestCase
from officer.factories import StoryFactory
from officer.models import Story


class OfficerProfileTestCase(BaseLiveTestCase):
    def setUp(self):
        self.login_user()
        self.visit('/admin/')
        self.officer = OfficerFactory()

    def tearDown(self):
        Officer.objects.all().delete()
        super(OfficerProfileTestCase, self).tearDown()

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

    def test_delete_story(self):
        officer = self.officer
        stories = [StoryFactory(officer=officer) for x in range(2)]
        self.go_to_officer_profile()
        self.find("#search-officer input").send_keys(officer.officer_first)
        self.find(".officer").click()

        self.until(lambda: self.should_see_text(stories[1].title))
        self.should_see_text(stories[0].title)

        self.find(".story .fa-trash").click()
        confirm_message = 'You are going to delete story "{title}"?'.format(title=stories[1].title)
        self.until(lambda: self.should_see_text(confirm_message))
        self.button("OK").click()
        self.until_ajax_complete()

        self.should_see_text('Story "{title}" has been deleted.'.format(title=stories[1].title))
        self.until_ajax_complete()  # reload story list
        self.until(lambda: self.should_not_see_text(stories[1].title))
        self.should_see_text(stories[0].title)

        self.find(".check-all").click()
        self.button("Delete").click()
        self.until(lambda: self.should_see_text("You are going to delete all stories of this officer?"))
        self.button("OK").click()
        self.until_ajax_complete()

        self.should_see_text("Stories have been deleted.")
        self.should_not_see_text(stories[0].title)

    def test_add_officer_story(self):
        officer = self.officer
        self.go_to_officer_profile()
        self.find("#search-officer input").send_keys(officer.officer_first)

        self.find(".officer").click()
        self.element_for_label('Title').send_keys("Title")
        self.element_for_label('Slug').send_keys("Slug")
        self.find(".story_short_description").send_keys("Short Description")
        self.find(".story_content").send_keys("Content")

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
        self.element_for_label('Slug').get_attribute('value').should.equal("title2")
        self.find(".story_short_description").text.should.equal("Short Description")
        self.find(".story_content").text.should.equal("Content")

        Story.objects.filter(officer=officer)[0].story_type.should.equal('news')

    def test_story_type_suggest(self):
        StoryFactory(story_type='abc')

        officer = self.officer
        self.go_to_officer_profile()
        self.find("#search-officer input").send_keys(officer.officer_first)
        self.find(".officer").click()

        select = self.find('.Select-input > input')
        select.send_keys('a')
        self.until(self.ajax_complete)
        self.element_by_classname_and_text('Select-option', 'abc').should.be.ok

    def test_story_type_add_new(self):
        officer = self.officer
        self.go_to_officer_profile()
        self.find("#search-officer input").send_keys(officer.officer_first)
        self.find(".officer").click()

        select = self.find('.Select-input > input')
        select.send_keys('abc')
        self.until(self.ajax_complete)
        self.element_by_classname_and_text('Select-option', 'New type: abc').should.be.ok

    def test_slugify_title(self):
        officer = self.officer
        self.go_to_officer_profile()
        self.find("#search-officer input").send_keys(officer.officer_first)

        self.find(".officer").click()
        self.element_for_label('Title').send_keys("Title ABC")
        self.element_for_label('Slug').get_attribute('value').should.equal("title-abc")
        self.element_for_label('Slug').send_keys("Slug")
        self.element_for_label('Slug').get_attribute('value').should.equal("title-abcslug")
