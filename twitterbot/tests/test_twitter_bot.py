import tweepy
from django.conf import settings
from mock import patch

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
