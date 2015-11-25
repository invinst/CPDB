from allegation.factories import AllegationFactory, OfficerFactory
from common.models import Officer
from common.tests.core import BaseLiveTestCase
from officer.factories import StoryFactory


class StoryViewTestCase(BaseLiveTestCase):
    def setUp(self):
        Officer.objects.all().delete()
        self.allegation = AllegationFactory()

    def visit_officer(self):
        self.visit_home()
        self.find(".officer-link").click()

    def test_display_stories(self):
        story = StoryFactory(officer=self.allegation.officer)
        self.visit_officer()

        self.until(lambda: self.should_see_text('News stories'))
        self.should_see_text(story.title)

    def test_hide_story_section(self):
        self.visit_officer()

        self.should_not_see_text('News stories')

    def test_long_description_cut(self):
        StoryFactory(officer=self.allegation.officer,
                     short_description="a b c" * 60)  # 300 chars

        self.visit_officer()
        self.should_see_text('Read more')
