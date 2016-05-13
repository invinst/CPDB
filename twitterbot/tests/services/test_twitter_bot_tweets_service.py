from unittest.mock import MagicMock

from common.tests.core import SimpleTestCase
from twitterbot.factories import TweetFactory
from twitterbot.services.twitter_bot_tweets_service import TwitterBotTweetsService


class TwitterBotTweetsServiceTestCase(SimpleTestCase):
    def test_get_all_related_tweets(self):
        replied_tweet = TweetFactory(user_id=124)
        level_2_quoted_tweet = TweetFactory(user_id=124)
        quoted_tweet = TweetFactory(quoted_tweet_id_str=level_2_quoted_tweet.id, user_id=124)
        retweeted_tweet = TweetFactory(user_id=124)
        incoming_tweet = TweetFactory(
            user_id=124,
            in_reply_to_tweet_id=replied_tweet.id,
            quoted_tweet=quoted_tweet,
            retweeted_tweet=retweeted_tweet
        )
        client = MagicMock(get_tweet=MagicMock(side_effect=[replied_tweet, level_2_quoted_tweet]),
                           get_current_user=MagicMock(return_value=MagicMock(id=123)))
        service = TwitterBotTweetsService(client)

        tweets = service.get_all_related_tweets(incoming_tweet)

        tweets.should.contain(level_2_quoted_tweet)
        tweets.should.contain(retweeted_tweet)
        tweets.should.contain(quoted_tweet)
        tweets.should.contain(replied_tweet)
        tweets.should.contain(incoming_tweet)

    def test_ignore_self_tweets(self):
        retweeted = TweetFactory(user_id=124)
        quoted = TweetFactory(user_id=124)
        requested_quoted = TweetFactory(user_id=124)
        replied_tweet = TweetFactory(user_id=124)
        tweet = TweetFactory(in_reply_to_tweet_id=replied_tweet.id, retweeted_tweet=retweeted, quoted_tweet=quoted)
        client = MagicMock(get_tweet=MagicMock(side_effect=[replied_tweet, requested_quoted]),
                           get_current_user=MagicMock(return_value=MagicMock(id=124)))
        service = TwitterBotTweetsService(client)

        tweets = service.get_all_related_tweets(tweet)

        tweets.should.contain(tweet)
        tweets.shouldnt.contain(replied_tweet)
        tweets.shouldnt.contain(quoted)
        tweets.shouldnt.contain(requested_quoted)
        tweets.shouldnt.contain(retweeted)
