from allegation.factories import OfficerFactory
from allegation.tests.constants import TEST_DOCUMENT_URL
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
        self.go_to_single_officer(officer)

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

    def test_reset_officer(self):
        officer = self.officer
        self.go_to_officer_profile()
        self.find("#search-officer input").send_keys(officer.officer_first)
        self.find(".officer").click()
        self.element_by_tagname_and_text('li', 'Edit information').click()
        random_string = "abc"
        
        text_fields = [
            'First name',
            'Last name',
            'Appt date',
            'Birth year',
            'Unit',
            'Star',
        ]
        for field in text_fields:
            element = self.element_for_label(field)
            old = element.get_attribute('value')
            element.send_keys(random_string)
            element.get_attribute('value').should.equal(old + random_string)

        select_fields = [
            ('Gender', 'F' if officer.gender=='M' else 'M'),
            ('Race', 'Black' if officer.gender=='White' else 'White'),
            ('Rank', 'Lieutenant' if officer.rank=='Detective' else 'Detective'),            
        ]
        for (field, value) in select_fields:
            element = self.element_for_label(field)
            element.select_by_visible_text(value)

        self.button("Reset").click()

        original_fields = [
            ('First name', officer.officer_first),
            ('Last name', officer.officer_last),
            ('Appt date', officer.appt_date),
            ('Birth year', officer.birth_year),
            ('Unit', officer.unit),
            ('Star', officer.star),
            ('Gender', officer.gender),
            ('Race', officer.race),
            ('Rank', officer.rank),
        ]        
        for (field, value) in original_fields:
            text = self.element_for_label(field).get_attribute('value')
            if text != '' and value is not None:
                text.should.equal(str(value))

    def test_delete_story(self):
        officer = self.officer
        stories = [StoryFactory(officer=officer) for x in range(2)]
        self.go_to_officer_profile()
        self.go_to_single_officer(officer)

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
        self.go_to_officer_profile()
        self.go_to_single_officer(self.officer)

        self.add_story(
            'Title',
            'Short Description',
            'Content',
            slug='Slug',
        )

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
        story = StoryFactory(story_type='Old')

        officer = self.officer
        self.go_to_officer_profile()
        self.find("#search-officer input").send_keys(officer.officer_first)
        self.find(".officer").click()

        select = self.find('.Select-input > input')
        select.send_keys(story.story_type[0])
        self.until(self.ajax_complete)
        self.element_by_classname_and_text('Select-option', story.story_type).should.be.ok

    def test_story_type_add_new(self):
        new_type = 'New'

        officer = self.officer
        self.go_to_officer_profile()
        self.find("#search-officer input").send_keys(officer.officer_first)
        self.find(".officer").click()

        select = self.find('.Select-input > input')
        select.send_keys(new_type)
        self.until(self.ajax_complete)
        self.element_by_classname_and_text('Select-option', 'New type: ' + new_type).should.be.ok

    def test_slugify_title(self):
        self.go_to_officer_profile()
        self.go_to_single_officer(self.officer)

        self.element_for_label('Title').send_keys("Title ABC")
        self.element_for_label('Slug').get_attribute('value').should.equal("title-abc")
        self.element_for_label('Slug').send_keys("Slug")
        self.element_for_label('Slug').get_attribute('value').should.equal("title-abcslug")

    def test_add_document_url_for_story(self):
        url = TEST_DOCUMENT_URL

        self.go_to_officer_profile()
        self.go_to_single_officer(self.officer)
        self.add_story(
            'Title',
            'Desc',
            'Content',
            url,
        )

        len(Story.objects.filter(url=url)).should.equal(1)
        
    def go_to_single_officer(self, officer):
        self.find("#search-officer input").send_keys(officer.officer_first)
        self.find(".officer").click()

    def add_story(self, title, desc, content, url='', slug=''):
        self.element_for_label('Title').send_keys(title)
        self.fill_medium_editor(".story_short_description", desc)
        self.fill_medium_editor(".story_content", content)
        self.element_for_label('Enter URL').send_keys(url)
        self.element_for_label('Slug').send_keys(slug)
        self.button("Save").click()
        self.until(self.ajax_complete)

    def fill_medium_editor(self, selector, keys):
        self.find(selector).send_keys('')
        self.sleep(.5)
        self.find(selector).send_keys(keys)
