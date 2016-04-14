from django.test.utils import override_settings
from mock import MagicMock

from allegation.factories import OfficerFactory
from common.tests.core import SimpleTestCase
from twitterbot.factories import TweetFactory
from twitterbot.models import TwitterResponse, TwitterBotResponseLog


class TwitterResponseTestCase(SimpleTestCase):
    def test_build_user_responses(self):
        response = TwitterResponse(entity=OfficerFactory(), incoming_tweet=TweetFactory())
        response.message = '{user} something else'
        response.recipients = ['user1', 'user2']

        messages = response.build_user_responses()

        len(messages).should.equal(len(response.recipients))
        for recipient in response.recipients:
            messages.should.contain('{user} something else'.format(user=recipient))

    @override_settings(TWITTER_ENTITY_URL_BASE='https://example.com')
    def test_update_message_url(self):
        officer = MagicMock()
        officer.absolute_view_url = '/absolute_url'

        incoming_tweet = TweetFactory(id=10)
        response = TwitterResponse(entity=officer, message='{url} something', incoming_tweet=incoming_tweet)

        expected_url = 'https://example.com/absolute_url?reply_to=10'

        response.update_message_url()

        response.message.should.contain(expected_url)
        response.entity_url.should.equal(expected_url)

    def test_save_log(self):
        TwitterBotResponseLog.objects.all().delete()

        response = TwitterResponse(incoming_tweet=TweetFactory(text='some text'))
        response.entity_url = 'some url'
        response.matched_strings = 'some strings'
        outgoing_tweet = TweetFactory()

        response.save_log(outgoing_tweet)

        TwitterBotResponseLog.objects.count().should.equal(1)
        log = TwitterBotResponseLog.objects.first()
        log.incoming_tweet_content.should.equal('some text')
        log.entity_url.should.equal('some url')
        log.matched_strings.should.equal('some strings')
        log.originating_tweet_content.should.be.none

    def test_save_log_with_originating_tweet(self):
        TwitterBotResponseLog.objects.all().delete()

        response = TwitterResponse(incoming_tweet=TweetFactory())
        response.entity_url = 'some url'
        response.originating_tweet = TweetFactory(text='some text')
        outgoing_tweet = TweetFactory()

        response.save_log(outgoing_tweet)

        TwitterBotResponseLog.objects.count().should.equal(1)
        log = TwitterBotResponseLog.objects.first()
        log.originating_tweet_content.should.equal('some text')
