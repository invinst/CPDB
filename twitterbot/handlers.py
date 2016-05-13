from responsebot.handlers.base import BaseTweetHandler

from twitterbot.services.twitter_bot_service import TwitterBotService
from twitterbot.utils.log import bot_log


class CPDBTweetHandler(BaseTweetHandler):
    def __init__(self, client, *args, **kwargs):
        super(CPDBTweetHandler, self).__init__(client=client, *args, **kwargs)
        self.twitter_service = TwitterBotService(client=client)

    def on_tweet(self, tweet):
        bot_log('Incoming tweet: {msg}'.format(msg=tweet.text))
        responses = self.twitter_service.build_responses(tweet)

        for response in responses:
            try:
                user_responses = response.build_user_responses()

                for user_response in user_responses:
                    outgoing_tweet = self.client.tweet(user_response)

                    if outgoing_tweet:
                        bot_log('Outgoing tweet: {msg}'.format(msg=user_response))
                        response.save_log(outgoing_tweet)
                    else:
                        bot_log('Unable to send: {msg}'.format(msg=user_response))
            except:
                # TODO: will try to find what to do here
                pass
