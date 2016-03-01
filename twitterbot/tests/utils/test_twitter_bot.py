from unittest.mock import patch, call
import tweepy
import vcr
from django.conf import settings

from allegation.factories import OfficerFactory, InvestigatorFactory
from common.models import Officer
from common.tests.core import SimpleTestCase
from common.utils.haystack import rebuild_index
from twitterbot.factories import ResponseFactory, TweetFactory
from twitterbot.models import Response
from twitterbot.utils import TwitterBot, ERR_DUPLICATED_RESPONSE


class TwitterBotTestCase(SimpleTestCase):
    def setUp(self):
        self.bot = TwitterBot(async=True)

    def tearDown(self):
        if self.bot.stream:
            self.bot.stream.disconnect()

    @vcr.use_cassette('twitterbot/fixtures/vcr/test_auth.yaml')
    def test_auth(self):
        bad_auth_data_code = 215
        cannot_auth_code = 32

        with self.settings(TWITTER_CONSUMER_KEY=''):
            try:
                self.bot.start()
            except tweepy.TweepError as e:
                e.api_code.should.equal(bad_auth_data_code)

        with self.settings(TWITTER_APP_TOKEN_KEY=''):
            try:
                self.bot.start()
            except tweepy.TweepError as e:
                e.api_code.should.equal(cannot_auth_code)

        try:
            self.bot.start()
            self.bot.tweet_handler.on_status(TweetFactory())
        except tweepy.TweepError as e:
            e.api_code.shouldnt.equal(bad_auth_data_code)
            e.api_code.shouldnt.equal(cannot_auth_code)


class CPDBTweetHandlerTestCase(SimpleTestCase):
    def setUp(self):
        self.response = ResponseFactory(type='officer', message='@{user} {{obj.officer_first}} {{obj.officer_last}}')
        ResponseFactory(type='investigator', message='investigator')
        OfficerFactory(officer_first='Jason', officer_last='Van Dyke')
        OfficerFactory(officer_first='Ruth', officer_last='Castelli')
        InvestigatorFactory(name='Daniel Neubeck')

        rebuild_index()

        self.setUpAPI()

    @vcr.use_cassette('twitterbot/fixtures/vcr/setUpAPI.yaml')
    def setUpAPI(self):
        self.bot = TwitterBot(async=True)
        self.bot.start()

    def tearDown(self):
        Response.objects.all().delete()
        Officer.objects.all().delete()
        self.bot.stream.disconnect()

    def test_error_handling(self):
        side_effect = tweepy.TweepError(api_code=ERR_DUPLICATED_RESPONSE, reason='Duplicated Message')
        with patch('twitterbot.utils.CPDBTweetHandler.reply', side_effect=side_effect):
            self.bot.tweet_handler.on_status(TweetFactory())

        not_ignored_code = -124
        side_effect = tweepy.TweepError(api_code=not_ignored_code, reason='Not Duplicated Message')
        with patch('twitterbot.utils.CPDBTweetHandler.reply', side_effect=side_effect):
            try:
                self.bot.tweet_handler.on_status(TweetFactory())
            except tweepy.TweepError as e:
                e.api_code.should.equal(not_ignored_code)

    def test_reply_name_in_status_text(self):
        text = '... Jason Van Dyke ...'
        screen_name = 'tweeter'

        with patch('tweepy.API.update_status') as update_status:
            self.bot.tweet_handler.on_status(TweetFactory(text=text, screen_name=screen_name))
            update_status.assert_called_once_with('@%s Jason Van Dyke' % screen_name)

    def test_reply_name_in_linked_websites(self):
        text = '... checkout this super sweet url ...'
        screen_name = 'tweeter'
        response = '@%s Ruth Castelli' % screen_name
        url = 'http://chicago.suntimes.com/chicago-politics/7/71/159374/tentative-1-25-million-deal-reached-in-fatal-police-shooting'  # NOQA

        with patch('tweepy.API.update_status') as update_status:
            self.bot.tweet_handler.on_status(
                TweetFactory(text=text,
                             urls=[{'expanded_url': url}],
                             screen_name=screen_name))
            update_status.assert_called_once_with(response)

    def test_reply_name_in_hashtag(self):
        text = '... #JasonVanDyke ...'
        screen_name = 'tweeter'

        with patch('tweepy.API.update_status') as update_status:
            self.bot.tweet_handler.on_status(TweetFactory(text=text, hashtags=[
                {'text': "#JasonVanDyke"},
            ], screen_name=screen_name))
            update_status.assert_called_once_with('@%s Jason Van Dyke' % screen_name)

    def test_reply_retweet(self):
        text = '... Jason Van Dyke ...'
        original = 'original'
        retweet = 'retweet'

        with patch('tweepy.API.update_status') as update_status:
            self.bot.tweet_handler.on_status(TweetFactory(
                text=text,
                retweeted_status=TweetFactory(
                    screen_name=retweet,
                    text=text
                ),
                screen_name=original
            ))

            original_reply = '@%s Jason Van Dyke' % original
            retweet_reply = '@%s Jason Van Dyke' % retweet
            update_status.assert_has_calls([call(original_reply), call(retweet_reply)], any_order=True)

    def test_reply_types(self):
        text = '... Jason Van Dyke Daniel Neubeck ...'
        screen_name = 'tweeter'

        with patch('tweepy.API.update_status') as update_status:
            self.bot.tweet_handler.on_status(TweetFactory(text=text, screen_name=screen_name))
            update_status.assert_has_calls([
                call('@%s Jason Van Dyke' % screen_name),
                call('investigator')
            ], any_order=True)

    def test_ignore_tweets_from_self(self):
        text = '... Jason Van Dyke ...'
        screen_name = settings.TWITTER_SCREEN_NAME

        with patch('tweepy.API.update_status') as update_status:
            self.bot.tweet_handler.on_status(TweetFactory(text=text, screen_name=screen_name))
            update_status.assert_not_called()
