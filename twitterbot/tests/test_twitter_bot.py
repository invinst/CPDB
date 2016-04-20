import tweepy
from django.conf import settings
from mock import patch, MagicMock

from common.tests.core import SimpleTestCase
from twitterbot.handlers import CPDBTweetHandler
from twitterbot.models import TwitterBotError
from twitterbot.twitter_bot import TwitterBot


class TwitterBotTestCase(SimpleTestCase):
    def setUp(self):
        auth = tweepy.OAuthHandler(settings.TWITTER_CONSUMER_KEY, settings.TWITTER_CONSUMER_SECRET)
        auth.set_access_token(settings.TWITTER_APP_TOKEN_KEY, settings.TWITTER_APP_TOKEN_SECRET)
        api = tweepy.API(auth)
        self.tweet_handler = CPDBTweetHandler(api)

        self.bot = TwitterBot()
        self.bot.api = api

    def tearDown(self):
        TwitterBotError.objects.all().delete()

    def test_self_sustain_on_error(self):
        e = Exception('some exception')
        with patch('tweepy.Stream.userstream', side_effect=e):
            try:
                self.bot.listen_to_tweets(self.tweet_handler)
            except:
                self.fail('Expect no exception raised')

    def test_error_logging(self):
        e = Exception('some exception')
        with patch('tweepy.Stream.userstream', side_effect=e):
            self.bot.listen_to_tweets(self.tweet_handler)

            TwitterBotError.objects.all()[0].stack_trace.should.equal(repr(e))

    def test_successful_auth(self):
        with patch('twitterbot.twitter_bot.tweepy.API.verify_credentials', side_effect=None):
            self.bot.listen_to_tweets = MagicMock()

            try:
                self.bot.start()

                self.bot.listen_to_tweets.called.should.be.true
            except:
                self.fail('Expect no exception but raised')

    def test_unsuccessful_auth(self):
        with patch('twitterbot.twitter_bot.tweepy.API.verify_credentials', side_effect=ValueError):
            self.assertRaises(ValueError, self.bot.start)
