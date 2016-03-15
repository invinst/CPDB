from collections import namedtuple
from unittest.mock import patch

import tweepy
from django.conf import settings

from allegation.factories import OfficerFactory, InvestigatorFactory
from common.models import Officer, Investigator
from common.tests.core import SimpleTestCase
from common.utils.haystack import rebuild_index
from twitterbot.factories import TweetFactory, ResponseFactory, QuotedTweetFactory
from twitterbot.utils import TweetUtils


class TweetUtilsTestCase(SimpleTestCase):
    def setUp(self):
        api = tweepy.API(None)
        self.utils = TweetUtils(api)

    def tearDown(self):
        Officer.objects.all().delete()
        Investigator.objects.all().delete()

    def test_get_all_screen_names_recursively(self):
        names = ['1', '2', '3', '4']
        status = TweetFactory(
            screen_name=names[0],
            user_mentions=[{'screen_name': names[2]}, {'screen_name': settings.TWITTER_SCREEN_NAME}],
            retweeted_status=TweetFactory(
                screen_name=names[1],
                quoted_status=QuotedTweetFactory(screen_name=names[0], quoted_status_id_str='quoted_id')
            )
        )

        with patch('tweepy.API.get_status', return_value=TweetFactory(screen_name=names[3])):
            screen_names = self.utils.get_screen_names_recursively(status)

            len(screen_names).should.equal(4)
            [screen_names.should.contain(name) for name in names]

    def test_get_all_content_recursively(self):
        status_text = 'status'
        status_text_1 = 'status1'
        linked_content = 'linked CPD'
        hashtag = '#HashTag'
        parsed_hashtag_text = ['Hash', 'Tag']
        url = 'http://example.com'

        status = TweetFactory(
            text=status_text,
            retweeted_status=TweetFactory(
                urls=[{'expanded_url': url}],
                quoted_status=QuotedTweetFactory(hashtags=[{'text': hashtag}], quoted_status_id_str='quoted_id')
            )
        )

        MockResponse = namedtuple('MockResponse', 'content')
        with patch('requests.get', return_value=MockResponse(content=bytearray(linked_content, encoding='utf-8'))):
            with patch('tweepy.API.get_status', return_value=TweetFactory(text=status_text_1)):
                text = self.utils.get_all_content_recursively(status)

                text.should.contain(status_text)
                text.should.contain(status_text_1)
                text.should.contain(linked_content)
                [text.should.contain(x) for x in parsed_hashtag_text]

    def test_find_names(self):
        text = 'Jason Van Dyke Haskell'
        expected_names = ['Jason Van', 'Van Dyke', 'Dyke Haskell']
        expected_3_word_names = ['Jason Van Dyke', 'Van Dyke Haskell']

        names = self.utils.find_names(text)
        names.should.equal(expected_names)

        names = self.utils.find_names(text, word_length=3)
        names.should.equal(expected_3_word_names)

    def parse_linked_websites(self):
        urls = [
            {'expanded_url': 'http://www.chicagoreader.com/chicago/fraternal-order-of-police-shootings-propaganda-pat-camden/Content?oid=21092544'}  # noqa
        ]
        text = self.utils.parse_linked_websites(urls)

        text.should.contain('Castelli')

    def test_parse_hashtags(self):
        hashtag = '#HashTag'
        parsed_hashtag_words = ['Hash', 'Tag']
        status = TweetFactory(
            hashtags=[{'text': hashtag}]
        )

        text = self.utils.parse_hashtags(status)
        text.should.equal(parsed_hashtag_words)

    def test_sanitize_text(self):
        dirty = '   !@#$%^&*()_+-=[]{}\\|`~;:\'",<.>/?f*ck you   '
        clean = 'f ck you'

        text = self.utils.sanitize_text(dirty)
        text.should.equal(clean)

    def test_build_officer_responses(self):
        ResponseFactory(response_type='officer', message='{{obj.officer_first}} {{obj.officer_last}}')
        officer = OfficerFactory(officer_first='Jason', officer_last='Van')
        rebuild_index()
        names = ['Jason Van', 'Van Dyke', 'Dyke Haskell']

        found = self.utils.build_officer_responses(names)
        len(found).should.equal(1)
        found[0].should.contain(officer.officer_first)
        found[0].should.contain(officer.officer_last)

    def test_investigator_response(self):
        ResponseFactory(response_type='investigator', message='{{obj.name}}')
        investigator = InvestigatorFactory(name='Daniel Neubeck')
        rebuild_index()
        names = ['Daniel Neubeck', 'Van Dyke', 'Dyke Haskell']

        found = self.utils.build_investigator_responses(names)
        len(found).should.equal(1)
        found[0].should.contain(investigator.name)

    def test_normalize_quoted_status(self):
        name = 'name'
        original = {'user': {'screen_name': name}}
        converted = self.utils.convert_quoted_status(original)

        converted.user.screen_name.should.equal(name)
