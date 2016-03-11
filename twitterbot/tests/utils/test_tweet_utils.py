from collections import namedtuple
from unittest.mock import patch

from allegation.factories import OfficerFactory, InvestigatorFactory
from common.models import Officer, Investigator
from common.tests.core import SimpleTestCase
from common.utils.haystack import rebuild_index
from twitterbot.factories import TweetFactory, ResponseFactory
from twitterbot.utils import TweetUtils


class TweetUtilsTestCase(SimpleTestCase):
    def setUp(self):
        self.utils = TweetUtils()

    def tearDown(self):
        Officer.objects.all().delete()
        Investigator.objects.all().delete()

    def test_get_all_content(self):
        status_text = 'status'
        linked_content = 'linked CPD'
        hashtag = '#HashTag'
        parsed_hashtag_text = 'Hash Tag'
        url = 'http://example.com'

        status = TweetFactory(
            text=status_text,
            urls=[{'expanded_url': url}],
            hashtags=[{'text': hashtag}]
        )

        MockResponse = namedtuple('MockResponse', 'content')
        with patch('requests.get', return_value=MockResponse(content=bytearray(linked_content, encoding='utf-8'))):
            text = self.utils.get_all_content(status)

            text.should.contain(status_text)
            text.should.contain(linked_content)
            text.should.contain(parsed_hashtag_text)

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
