from unittest.mock import MagicMock

from django.conf import settings
from mock import patch, call
from tweepy.error import TweepError

from common.tests.core import SimpleTestCase
from twitterbot.factories import TweetFactory
from twitterbot.handlers import CPDBTweetHandler


class CPDBTweetHandlerTestCase(SimpleTestCase):
    def setUp(self):
        api = MagicMock(update_status=MagicMock(return_value=TweetFactory()))
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

    def test_raise_error_on_not_ignored_errors(self):
        self.handler.reply = MagicMock(side_effect=ValueError)
        self.assertRaises(ValueError, self.handler.on_status, status=TweetFactory())

    def test_call_tweepy_update_status(self):
        message = 'some message'
        response = MagicMock(build_user_responses=MagicMock(return_value=[message]))

        with patch('twitterbot.services.twitter_bot_service.TwitterBotService.build_responses',
                   return_value=[response]):
            self.handler.reply(TweetFactory())

            self.handler.api.update_status.assert_called_once_with(message)

    def test_call_save_log(self):
        response = MagicMock(save_log=MagicMock(),
                             build_user_responses=MagicMock(return_value=['message_1', 'message_2']))
        outgoing_tweet_1 = TweetFactory()
        outgoing_tweet_2 = TweetFactory()
        self.handler.twitter_service.build_responses = MagicMock(return_value=[response])
        self.handler.api.update_status = MagicMock(side_effect=[outgoing_tweet_1, outgoing_tweet_2])

        self.handler.reply(TweetFactory())
        response.save_log.assert_has_calls([call(outgoing_tweet_1), call(outgoing_tweet_2)])

    def test_debug_log_when_unable_to_tweet(self):
        self.handler.api.update_status = MagicMock(return_value=None)
        self.handler.twitter_service.build_responses = MagicMock(
            return_value=[MagicMock(build_user_responses=MagicMock(return_value=['msg']))]
        )

        with patch('twitterbot.handlers.bot_log') as mock_bot_log:
            self.handler.reply(TweetFactory())

            mock_bot_log.assert_has_calls([call('Incoming tweet: Random text here'), call('Unable to send: msg')])
