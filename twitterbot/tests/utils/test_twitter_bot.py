from unittest.mock import patch, call
import tweepy
from django.conf import settings

from allegation.factories import OfficerFactory, InvestigatorFactory
from common.models import Officer
from common.tests.core import SimpleTestCase
from common.utils.haystack import rebuild_index
from twitterbot.factories import ResponseFactory, TweetFactory, QuotedTweetFactory
from twitterbot.models import Response
from twitterbot.utils import ERR_DUPLICATED_RESPONSE, CPDBTweetHandler


class CPDBTweetHandlerTestCase(SimpleTestCase):
    def setUp(self):
        self.response = ResponseFactory(
            response_type='officer',
            message='@{user} {{obj.officer_first}} {{obj.officer_last}}')
        ResponseFactory(response_type='investigator', message='investigator')
        OfficerFactory(officer_first='Jason', officer_last='Van Dyke')
        OfficerFactory(officer_first='Ruth', officer_last='Castelli')
        InvestigatorFactory(name='Daniel Neubeck')

        rebuild_index()

        auth = tweepy.OAuthHandler(settings.TWITTER_CONSUMER_KEY, settings.TWITTER_CONSUMER_SECRET)
        auth.set_access_token(settings.TWITTER_APP_TOKEN_KEY, settings.TWITTER_APP_TOKEN_SECRET)
        api = tweepy.API(auth)
        self.tweet_handler = CPDBTweetHandler(api)

    def tearDown(self):
        Response.objects.all().delete()
        Officer.objects.all().delete()

    def test_error_handling(self):
        side_effect = tweepy.TweepError(api_code=ERR_DUPLICATED_RESPONSE, reason='Duplicated Message')
        with patch('twitterbot.utils.CPDBTweetHandler.reply', side_effect=side_effect):
            self.tweet_handler.on_status(TweetFactory())

        not_ignored_code = -124
        side_effect = tweepy.TweepError(api_code=not_ignored_code, reason='Not Duplicated Message')
        with patch('twitterbot.utils.CPDBTweetHandler.reply', side_effect=side_effect):
            try:
                self.tweet_handler.on_status(TweetFactory())
            except tweepy.TweepError as e:
                e.api_code.should.equal(not_ignored_code)

    def test_reply_name_in_status_text(self):
        text = '... Jason Van Dyke ...'
        screen_name = 'tweeter'

        with patch('tweepy.API.update_status') as update_status:
            self.tweet_handler.on_status(TweetFactory(text=text, screen_name=screen_name))
            update_status.assert_called_once_with('@%s Jason Van Dyke' % screen_name)

    def test_reply_name_in_linked_websites(self):
        text = '... checkout this super sweet url ...'
        screen_name = 'tweeter'
        response = '@%s Ruth Castelli' % screen_name
        url = 'http://chicago.suntimes.com/chicago-politics/7/71/159374/tentative-1-25-million-deal-reached-in-fatal-police-shooting'  # NOQA

        with patch('tweepy.API.update_status') as update_status:
            self.tweet_handler.on_status(
                TweetFactory(text=text,
                             urls=[{'expanded_url': url}],
                             screen_name=screen_name))
            update_status.assert_called_once_with(response)

    def test_reply_name_in_hashtag(self):
        text = '... #JasonVanDyke ...'
        screen_name = 'tweeter'

        with patch('tweepy.API.update_status') as update_status:
            self.tweet_handler.on_status(TweetFactory(text=text, hashtags=[
                {'text': "#JasonVanDyke"},
            ], screen_name=screen_name))
            update_status.assert_called_once_with('@%s Jason Van Dyke' % screen_name)

    def test_reply_retweet(self):
        text = ''
        original = 'original'
        retweet = 'retweet'

        with patch('tweepy.API.update_status') as update_status:
            self.tweet_handler.on_status(TweetFactory(
                text='Jason Van Dyke',
                retweeted_status=TweetFactory(
                    screen_name=retweet,
                    text=text
                ),
                screen_name=original
            ))

            original_reply = '@%s Jason Van Dyke' % original
            retweet_reply = '@%s Jason Van Dyke' % retweet
            update_status.assert_has_calls([call(original_reply), call(retweet_reply)], any_order=True)

    def test_reply_retweet_with_comment(self):
        text = '... Jason Van Dyke ...'
        original = 'original'
        retweet = 'retweet'

        with patch('tweepy.API.update_status') as update_status:
            self.tweet_handler.on_status(TweetFactory(
                text=text,
                quoted_status=QuotedTweetFactory(
                    screen_name=retweet,
                    text=text
                ),
                screen_name=original
            ))

            original_reply = '@%s Jason Van Dyke' % original
            retweet_reply = '@%s Jason Van Dyke' % retweet
            update_status.assert_has_calls([call(original_reply), call(retweet_reply)], any_order=True)

    def test_reply_retweet_with_link(self):
        text = '... check this out ...'
        original = 'original'
        retweet = 'retweet'
        url = 'http://chicago.suntimes.com/chicago-politics/7/71/159374/tentative-1-25-million-deal-reached-in-fatal-police-shooting'  # NOQA

        with patch('tweepy.API.update_status') as update_status:
            self.tweet_handler.on_status(TweetFactory(
                text=text,
                retweeted_status=TweetFactory(
                    screen_name=retweet,
                    urls=[{'expanded_url': url}],
                    text=text
                ),
                screen_name=original
            ))

            original_reply = '@%s Ruth Castelli' % original
            retweet_reply = '@%s Ruth Castelli' % retweet
            update_status.assert_has_calls([call(original_reply), call(retweet_reply)], any_order=True)

    def test_reply_types(self):
        text = '... Jason Van Dyke Daniel Neubeck ...'
        screen_name = 'tweeter'

        with patch('tweepy.API.update_status') as update_status:
            self.tweet_handler.on_status(TweetFactory(text=text, screen_name=screen_name))
            update_status.assert_has_calls([
                call('@%s Jason Van Dyke' % screen_name),
                call('investigator')
            ], any_order=True)

    def test_ignore_tweets_from_self(self):
        text = '... Jason Van Dyke ...'
        screen_name = settings.TWITTER_SCREEN_NAME

        with patch('tweepy.API.update_status') as update_status:
            self.tweet_handler.on_status(TweetFactory(text=text, screen_name=screen_name))
            update_status.assert_not_called()
