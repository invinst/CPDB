from mock import MagicMock

from allegation.factories import OfficerFactory
from common.tests.core import SimpleTestCase
from common.utils.haystack import rebuild_index
from twitterbot.factories import TweetFactory, ResponseTemplateFactory
from twitterbot.services.twitter_bot_service import TwitterBotService


class TwitterBotServiceTestCase(SimpleTestCase):
    def setUp(self):
        self.service = TwitterBotService(MagicMock())

    def test_build_responses(self):
        ResponseTemplateFactory(response_type='officer', message='@{user} {{obj.display_name}} {tweet_id}')
        poster = 'poster'
        officer = OfficerFactory(officer_first='John', officer_last='Doe')
        rebuild_index()
        incoming_tweet = TweetFactory(screen_name=poster,
                                      text=officer.display_name)

        responses = self.service.build_responses(incoming_tweet)

        responses.should.contain('@{user} {msg} {id}'.format(user=poster, msg=officer.display_name,
                                                             id=incoming_tweet.id))

    def test_get_recipients(self):
        poster = 'poster'
        mentioned = 'mentioned'
        self.service.statuses = [TweetFactory(screen_name=poster, user_mentions=[{'screen_name': mentioned}])]

        recipients = self.service.get_recipients()

        recipients.should.contain(poster)
        recipients.should.contain(mentioned)
