import tweepy
from django.conf import settings

from twitterbot.handlers import CPDBTweetHandler
from twitterbot.models import TwitterBotError
from twitterbot.utils.log import bot_log


class TwitterBot:
    def __init__(self):
        self.api = None

    def start(self):
        self.auth()

        tweet_handler = CPDBTweetHandler(self.api)
        self.listen_to_tweets(tweet_handler)

    def auth(self):
        auth = tweepy.OAuthHandler(settings.TWITTER_CONSUMER_KEY, settings.TWITTER_CONSUMER_SECRET)
        auth.set_access_token(settings.TWITTER_APP_TOKEN_KEY, settings.TWITTER_APP_TOKEN_SECRET)
        self.api = tweepy.API(auth)

        self.api.verify_credentials()

    def listen_to_tweets(self, handler):
        stream = tweepy.Stream(auth=self.api.auth, listener=handler)
        is_ok = self.handle_stream(stream)

        bot_log('Ready to receive tweet')

        while not is_ok and settings.DJANGO_ENV != 'test':
            is_ok = self.handle_stream(stream)

    def handle_stream(self, stream):
        try:
            stream.userstream()
            return True
        except Exception as e:
            bot_log('Encounter error while streaming')

            TwitterBotError(stack_trace=repr(e)).save()
            return False
