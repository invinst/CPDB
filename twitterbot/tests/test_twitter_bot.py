from mock import patch, MagicMock
from tweepy.error import TweepError

from common.tests.core import SimpleTestCase
from twitterbot.models import TwitterBotError
from twitterbot.twitter_bot import TwitterBot


class TwitterBotTestCase(SimpleTestCase):
    def tearDown(self):
        TwitterBotError.objects.all().delete()

    @patch('twitterbot.twitter_bot.tweepy.API')
    @patch('twitterbot.twitter_bot.CPDBTweetHandler')
    def test_self_sustain_on_error(self, mock_handler, mock_api):
        e = Exception('some exception')
        with patch('tweepy.Stream.userstream', side_effect=e):
            try:
                bot = TwitterBot()
                bot.api = mock_api

                bot.listen_to_tweets(mock_handler)
            except:
                self.fail('Expect no exception raised')

    @patch('twitterbot.twitter_bot.tweepy.API')
    @patch('twitterbot.twitter_bot.CPDBTweetHandler')
    def test_error_logging(self, mock_handler, mock_api):
        e = Exception('some exception')
        with patch('tweepy.Stream.userstream', side_effect=e):
            bot = TwitterBot()
            bot.api = mock_api
            bot.listen_to_tweets(mock_handler)

            TwitterBotError.objects.all()[0].stack_trace.should.equal(repr(e))

    @patch('twitterbot.twitter_bot.tweepy.API')
    @patch('twitterbot.twitter_bot.CPDBTweetHandler')
    def test_successful_auth(self, mock_handler, mock_api):
        with patch('twitterbot.twitter_bot.tweepy.API.verify_credentials', side_effect=None),\
                patch('twitterbot.handlers.tweepy.API.me', side_effect=None):
            bot = TwitterBot()
            bot.listen_to_tweets = MagicMock()

            try:
                bot.start()
                bot.listen_to_tweets.called.should.be.true
            except TweepError:
                self.fail('Expect no TweepError but raised')

    @patch('twitterbot.twitter_bot.tweepy.API', side_effect=ValueError)
    @patch('twitterbot.twitter_bot.CPDBTweetHandler')
    def test_unsuccessful_auth(self, mock_handler, mock_api):
        bot = TwitterBot()
        self.assertRaises(ValueError, bot.start)
