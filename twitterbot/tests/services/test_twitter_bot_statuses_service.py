from unittest.mock import MagicMock

from common.tests.core import SimpleTestCase
from twitterbot.factories import TweetFactory, QuotedTweetFactory
from twitterbot.services.twitter_bot_statuses_service import TwitterBotStatusesService


class TwitterBotStatusesServiceTestCase(SimpleTestCase):
    def test_get_all_related_statuses(self):
        replied_status = TweetFactory()
        level_2_quoted_status = TweetFactory()
        quoted_status = QuotedTweetFactory(quoted_status_id_str=level_2_quoted_status.id)
        retweeted_status = TweetFactory()
        incoming_tweet = TweetFactory(
            in_reply_to_status_id=replied_status.id,
            quoted_status=quoted_status,
            retweeted_status=retweeted_status
        )
        api = MagicMock(get_status=MagicMock(side_effect=[replied_status, level_2_quoted_status]))
        service = TwitterBotStatusesService(api)

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
        service = TwitterBotStatusesService(api)
        converted = service._convert_quoted_status(quoted)

        converted.text.should.equal(text)
        converted.user.screen_name.should.equal(screen_name)
        converted.retweeted_status.should.equal(retweeted_status)
        converted.quoted_status.should.equal(quoted_status)
        converted.quoted_status_id_str.should.equal(quoted_status_id_str)
        converted.id.should.equal(id)
