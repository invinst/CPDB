class TwitterBotTweetsService:
    def __init__(self, client):
        self.client = client
        self.user = self.client.get_current_user()

    def get_all_related_tweets(self, tweet):
        if self.is_self_tweet(tweet):
            return []
        else:
            tweets = [tweet]

        if getattr(tweet, 'in_reply_to_tweet_id', None):
            replied_tweet = self.client.get_tweet(tweet.in_reply_to_tweet_id)
            tweets += self.get_all_related_tweets(replied_tweet)

        if getattr(tweet, 'retweeted_tweet', None):
            tweets += self.get_all_related_tweets(tweet.retweeted_tweet)

        if getattr(tweet, 'quoted_tweet', None):
            tweets += self.get_all_related_tweets(tweet.quoted_tweet)
        elif getattr(tweet, 'quoted_tweet_id_str', None):
            quoted_tweet = self.client.get_tweet(tweet.quoted_tweet_id_str)
            tweets += self.get_all_related_tweets(quoted_tweet)

        return tweets

    def is_self_tweet(self, tweet):
        return tweet.user.id == self.user.id
