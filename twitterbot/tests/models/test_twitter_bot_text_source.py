from common.tests.core import SimpleTestCase
from twitterbot.models import TwitterBotTextSource


class TwitterBotTextSourceTestCase(SimpleTestCase):
    def test_adding_sources_for_status_text(self):
        text = 'Something Jason Van Dyke something'

        text_source = TwitterBotTextSource(text=text, source='text')
        names = text_source.build_names()

        len(names).should.equal(7)
        for name, source in names:
            name.should.equal(source)

    def test_adding_sources_for_linked_articles_and_hashtags(self):
        text = 'Something Jason Van Dyke something'
        common_source = 'source'

        text_source = TwitterBotTextSource(text=text, source=common_source)
        names = text_source.build_names()

        len(names).should.equal(7)
        for _, source in names:
            source.should.equal(common_source)
