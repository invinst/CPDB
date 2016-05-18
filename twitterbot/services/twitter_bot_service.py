from twitterbot.services.twitter_bot_names_service import TwitterBotNamesService
from twitterbot.services.twitter_bot_responses_service import TwitterBotResponsesService
from twitterbot.services.twitter_bot_tweets_service import TwitterBotTweetsService
from twitterbot.utils.log import bot_log


class TwitterBotService:
    def __init__(self, client):
        self.client = client
        self.user = self.client.get_current_user()
        self.tweets = []
        self.names = []

    def build_responses(self, tweet):
        self.cache_all_related_tweets(tweet)
        self.cache_names()

        responses = self.get_responses()
        recipients = self.get_recipients()
        originating_tweet = self.get_originating_tweet()

        bot_log('No. responses: {num}'.format(num=len(responses)))
        bot_log('No. user responses: {num}'.format(num=len(responses) * len(recipients)))

        for response in responses:
            response.recipients = recipients
            response.incoming_tweet = tweet
            response.originating_tweet = originating_tweet

        return responses

    def cache_all_related_tweets(self, tweet):
        """
        Cache list of all related tweets including original tweet
        :param tweet: incoming tweet
        :return: list of all tweets we want to process
        """
        self.tweets = TwitterBotTweetsService(self.client).get_all_related_tweets(tweet)

    def cache_names(self):
        """
        Cache list of names we will check in our database to find officer
        """
        self.names = TwitterBotNamesService(self.tweets).get_all_names()

    def get_recipients(self):
        """
        Get list of users we will reply to
        """
        screen_names = []
        for tweet in self.tweets:
            screen_names.append(tweet.user.screen_name)
            screen_names += [x['screen_name'] for x in tweet.entities['user_mentions']]

        return [x for x in set(screen_names) if x != self.user.screen_name]

    def get_responses(self):
        """
        Get list of responses we will send to each user
        """
        return TwitterBotResponsesService(self.names).build_responses()

    def get_originating_tweet(self):
        if len(self.tweets) > 1:
            originating_tweet = self.tweets[0]

            for tweet in self.tweets[1:]:
                if tweet.created_at < originating_tweet.created_at:
                    originating_tweet = tweet

            return originating_tweet
        else:
            return None
