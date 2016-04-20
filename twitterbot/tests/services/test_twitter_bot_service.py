from datetime import datetime, timedelta

from mock import MagicMock

from allegation.factories import OfficerFactory
from common.tests.core import SimpleTestCase
from common.utils.haystack import rebuild_index
from twitterbot.factories import TweetFactory, ResponseTemplateFactory
from twitterbot.services.twitter_bot_service import TwitterBotService


class TwitterBotServiceTestCase(SimpleTestCase):
    def setUp(self):
        self.service = TwitterBotService(MagicMock())

    def test_build_responses(self):
        officer = OfficerFactory()

        rebuild_index()

        ResponseTemplateFactory(response_type='officer')
        originating_tweet = TweetFactory(text=officer.display_name)
        incoming_tweet = TweetFactory(retweeted_status=originating_tweet)
        self.service.get_recipients = MagicMock(return_value=['r1', 'r2'])

        responses = self.service.build_responses(incoming_tweet)

        len(responses).should.equal(1)
        for response in responses:
            response.recipients.should.equal(['r1', 'r2'])
            response.incoming_tweet.should.be(incoming_tweet)
            response.originating_tweet.should.be(originating_tweet)

    def test_get_recipients(self):
        poster = 'poster'
        mentioned = 'mentioned'
        self.service.statuses = [TweetFactory(screen_name=poster, user_mentions=[{'screen_name': mentioned}])]

        recipients = self.service.get_recipients()

        recipients.should.contain(poster)
        recipients.should.contain(mentioned)

    def test_get_originating_tweet(self):
        oldest_tweet = TweetFactory(created_at=datetime.strptime('01-01-1970 00:00:00', '%d-%m-%Y %H:%M:%S'))
        self.service.statuses = [
            oldest_tweet,
            TweetFactory(created_at=oldest_tweet.created_at + timedelta(days=1)),
            TweetFactory(created_at=oldest_tweet.created_at + timedelta(days=2))
        ]

        originating_tweet = self.service.get_originating_tweet()

        originating_tweet.should.be(oldest_tweet)

    def test_get_non_existent_originating_tweet(self):
        self.service.statuses = [
            TweetFactory()
        ]

        originating_tweet = self.service.get_originating_tweet()

        originating_tweet.should.be.none
