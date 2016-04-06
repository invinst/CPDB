import tweepy
from django.conf import settings

from twitterbot.services.twitter_bot_service import TwitterBotService
from twitterbot.utils.log import bot_log

ERR_DUPLICATED_RESPONSE = 187
IGNORED_ERROR_CODES = [
    ERR_DUPLICATED_RESPONSE,
]


class CPDBTweetHandler(tweepy.StreamListener):
    def __init__(self, api, *args, **kwargs):
        super(CPDBTweetHandler, self).__init__(api=api, *args, **kwargs)
        self.twitter_service = TwitterBotService(api)

    def on_status(self, status):
        if self.is_own_tweet(status):
            return

        try:
            self.reply(status)
        except tweepy.TweepError as e:
            if e.api_code in IGNORED_ERROR_CODES:
                pass

    def reply(self, status):
        bot_log('Incoming tweet: {msg}'.format(msg=status.text))
        responses = self.twitter_service.build_responses(status)

        for response in responses:
            try:
                bot_log('Outgoing tweet: {msg}'.format(msg=response))
                self.api.update_status(response)
            except:
                # TODO: will try to find what to do here
                pass

    def is_own_tweet(self, status):
        return status.user.screen_name == settings.TWITTER_SCREEN_NAME
