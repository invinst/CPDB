from unittest.mock import MagicMock

from mock import patch, call

from common.tests.core import SimpleTestCase
from twitterbot.factories import TweetFactory
from twitterbot.handlers import CPDBTweetHandler


class CPDBTweetHandlerTestCase(SimpleTestCase):
    def setUp(self):
        tweet = MagicMock(return_value=TweetFactory())
        client = MagicMock(tweet=tweet)
        self.handler = CPDBTweetHandler(client)

    def test_call_responsebot_client_tweet(self):
        message = 'some message'
        response = MagicMock(build_user_responses=MagicMock(return_value=[message]))

        with patch('twitterbot.services.twitter_bot_service.TwitterBotService.build_responses',
                   return_value=[response]):
            self.handler.on_tweet(TweetFactory())

            self.handler.client.tweet.assert_called_once_with(message)

    def test_call_save_log(self):
        response = MagicMock(save_log=MagicMock(),
                             build_user_responses=MagicMock(return_value=['message_1', 'message_2']))
        outgoing_tweet_1 = TweetFactory()
        outgoing_tweet_2 = TweetFactory()
        self.handler.twitter_service.build_responses = MagicMock(return_value=[response])
        self.handler.client.tweet = MagicMock(side_effect=[outgoing_tweet_1, outgoing_tweet_2])

        self.handler.on_tweet(TweetFactory())
        response.save_log.assert_has_calls([call(outgoing_tweet_1), call(outgoing_tweet_2)])

    def test_debug_log_when_unable_to_tweet(self):
        self.handler.client.tweet = MagicMock(return_value=None)
        self.handler.twitter_service.build_responses = MagicMock(
            return_value=[MagicMock(build_user_responses=MagicMock(return_value=['msg']))]
        )

        with patch('twitterbot.handlers.bot_log') as mock_bot_log:
            self.handler.on_tweet(TweetFactory())

            mock_bot_log.assert_has_calls([call('Incoming tweet: Random text here'), call('Unable to send: msg')])
