from allegation.factories import OfficerAllegationFactory
from common.models import Officer
from common.tests.core import BaseLiveTestCase
from officer.factories import StoryFactory


class StoryViewTestCase(BaseLiveTestCase):
    def setUp(self):
        Officer.objects.all().delete()
        self.officer_allegation = OfficerAllegationFactory()
        self.officer = self.officer_allegation.officer

    def visit_officer(self):
        self.visit(
            "/officer/{officer.officer_first}-{officer.officer_last}/{officer.id}"
            .format(officer=self.officer))

    def test_display_stories(self):
        story = StoryFactory(officer=self.officer)
        self.visit_officer()

        self.until(lambda: self.should_see_text(story.story_type.capitalize()))
        self.should_see_text(story.title)

    def test_long_description_cut(self):
        StoryFactory(
            officer=self.officer,
            short_description="a b c" * 60)  # 300 chars

        self.visit_officer()
        self.until(lambda: self.should_see_text('Read more'))

    def test_story_category_order(self):
        story_type1 = 'story_type1'
        story_type2 = 'story_type2'
        StoryFactory(officer=self.officer, story_type=story_type1)
        StoryFactory(officer=self.officer, story_type=story_type2)

        settings = self.get_admin_settings()
        settings.story_types_order = ','.join([story_type2, story_type1])
        settings.save()

        self.visit_officer()

        story_type_titles = self.find_all('#story_list h3')
        story_type_titles[0].text.should.equal(story_type2.capitalize())
        story_type_titles[1].text.should.equal(story_type1.capitalize())

    def test_story_category_with_empty_setting(self):
        story_type = 'story_type'
        StoryFactory(officer=self.officer, story_type=story_type)

        settings = self.get_admin_settings()
        settings.story_types_order = ''
        settings.save()

        self.visit_officer()

        self.element_by_tagname_and_text('h3', story_type).should.be.ok
