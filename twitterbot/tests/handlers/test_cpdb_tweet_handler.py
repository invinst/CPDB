from unittest.mock import MagicMock

from django.conf import settings
from mock import patch
from tweepy.error import TweepError

from common.tests.core import SimpleTestCase
from twitterbot.factories import TweetFactory
from twitterbot.handlers import CPDBTweetHandler


class CPDBTweetHandlerTestCase(SimpleTestCase):
    def setUp(self):
        api = MagicMock(update_status=MagicMock())
        self.handler = CPDBTweetHandler(api)

    def test_not_response_to_own_tweets(self):
        self.handler.reply = MagicMock()
        self.handler.on_status(TweetFactory(screen_name=settings.TWITTER_SCREEN_NAME))

        self.handler.reply.called.should.be.false

    def test_do_not_crash_on_ignored_errors(self):
        self.handler.reply = MagicMock(side_effect=TweepError(reason='duplicated_response', api_code=187))
        try:
            self.handler.on_status(TweetFactory())
        except:
            self.fail('Raised exception when not expected to')

    def test_call_tweepy_update_status(self):
        message = 'Some response'

        with patch('twitterbot.services.twitter_bot_service.TwitterBotService.build_responses',
                   return_value=[message]):
            self.handler.reply(TweetFactory())

            self.handler.api.update_status.assert_called_once_with(message)
