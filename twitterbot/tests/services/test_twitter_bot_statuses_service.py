from unittest.mock import MagicMock

from common.tests.core import SimpleTestCase
from twitterbot.factories import TweetFactory, QuotedTweetFactory
from twitterbot.services.twitter_bot_statuses_service import TwitterBotStatusesService


class TwitterBotStatusesServiceTestCase(SimpleTestCase):
    def test_get_all_related_statuses(self):
        replied_status = TweetFactory(user_id=124)
        level_2_quoted_status = TweetFactory(user_id=124)
        quoted_status = QuotedTweetFactory(quoted_status_id_str=level_2_quoted_status.id, user_id=124)
        retweeted_status = TweetFactory(user_id=124)
        incoming_tweet = TweetFactory(
            user_id=124,
            in_reply_to_status_id=replied_status.id,
            quoted_status=quoted_status,
            retweeted_status=retweeted_status
        )
        api = MagicMock(get_status=MagicMock(side_effect=[replied_status, level_2_quoted_status]))
        service = TwitterBotStatusesService(api, MagicMock(id=123))

        tweets = service.get_all_related_statuses(incoming_tweet)

        tweets.should.contain(level_2_quoted_status)
        tweets.should.contain(retweeted_status)
        tweets.should.contain(replied_status)
        tweets.should.contain(incoming_tweet)

        [x.id for x in tweets].should.contain(quoted_status['id'])

    def test_convert_quoted_status(self):
        text = 'text'
        screen_name = 'user'
        retweeted_status = 'retweeted_status'
        quoted_status = 'quoted_status'
        quoted_status_id_str = 'quoted_status_id_str'
        id = 'id'

        quoted = QuotedTweetFactory(
            retweeted_status=retweeted_status,
            quoted_status=quoted_status,
            screen_name=screen_name,
            quoted_status_id_str=quoted_status_id_str,
            id=id,
            text=text
        )
        api = MagicMock(get_status=MagicMock())
        service = TwitterBotStatusesService(api, MagicMock(id=123))
        converted = service._convert_quoted_status(quoted)

        converted.text.should.equal(text)
        converted.user.screen_name.should.equal(screen_name)
        converted.retweeted_status.should.equal(retweeted_status)
        converted.quoted_status.should.equal(quoted_status)
        converted.quoted_status_id_str.should.equal(quoted_status_id_str)
        converted.id.should.equal(id)

    def test_ignore_self_tweets(self):
        retweeted = TweetFactory(user_id=124)
        converted_quoted = TweetFactory(user_id=124)
        requested_quoted = TweetFactory(user_id=124)
        status = TweetFactory(retweeted_status=retweeted, quoted_status=MagicMock())
        api = MagicMock(get_status=MagicMock(get_status=MagicMock(return_value=requested_quoted)))
        service = TwitterBotStatusesService(api, user=MagicMock(id=124))
        service._convert_quoted_status = MagicMock(return_value=converted_quoted)

        statuses = service.get_all_related_statuses(status)

        statuses.should.contain(status)
        statuses.shouldnt.contain(converted_quoted)
        statuses.shouldnt.contain(requested_quoted)
        statuses.shouldnt.contain(retweeted)
