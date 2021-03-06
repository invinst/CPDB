from unittest.mock import patch, MagicMock

from allegation.factories import OfficerFactory
from common.tests.core import SimpleTestCase
from twitterbot.factories import TweetFactory
from twitterbot.services.twitter_bot_names_service import TwitterBotNamesService


class TwitterBotNamesServiceTestCase(SimpleTestCase):
    @patch('requests.get', return_value=MagicMock(content=b''))
    def test_get_all_names(self, mock_requests_get):
        two_words_named_officer = OfficerFactory(officer_first='John', officer_last='Doe')
        three_words_named_officer = OfficerFactory(officer_first='John', officer_last='von Doe')
        hashtagged_officer = OfficerFactory(officer_first='Hash', officer_last='Tagged')
        relevant_officer_1 = OfficerFactory(officer_first='Relevant', officer_last='1')
        relevant_officer_2 = OfficerFactory(officer_first='Relevant', officer_last='2')
        relevant_linked_text_1 = 'CPD {name}'.format(name=relevant_officer_1.display_name)
        relevant_linked_text_2 = 'Chicago Police {name}'.format(name=relevant_officer_2.display_name)
        url = 'http://url.com'
        tweets = [
            TweetFactory(text=two_words_named_officer.display_name),
            TweetFactory(text=three_words_named_officer.display_name),
            TweetFactory(urls=[{'expanded_url': url}]),
            TweetFactory(hashtags=[{'text': '#{first}{last}'.format(
                first=hashtagged_officer.officer_first,
                last=hashtagged_officer.officer_last
            )}]),
        ]
        service = TwitterBotNamesService(tweets)

        with patch('bs4.BeautifulSoup.getText', return_value=relevant_linked_text_1):
            names = service.get_all_names()

            names.should.contain(two_words_named_officer.display_name)
            names.should.contain(three_words_named_officer.display_name)
            names.should.contain(relevant_officer_1.display_name)
            names.should.contain(hashtagged_officer.display_name)

        with patch('bs4.BeautifulSoup.getText', return_value=relevant_linked_text_2):
            names = service.get_all_names()

            names.should.contain(relevant_officer_2.display_name)

    @patch('requests.get', return_value=MagicMock(content=b''))
    def test_do_not_get_names_from_unrelevant_articles(self, mock_requests_get):
        non_relevant_officer = OfficerFactory(officer_first='Non', officer_last='Relevant')
        non_relevant_linked_text = non_relevant_officer.display_name
        url = 'http://url.com'
        tweets = [
            TweetFactory(urls=[{'expanded_url': url}])
        ]
        service = TwitterBotNamesService(tweets)

        with patch('bs4.BeautifulSoup.getText', return_value=non_relevant_linked_text):
            names = service.get_all_names()

            names.shouldnt.contain(non_relevant_officer.display_name)

    def test_build_text_source_ignore_retweets(self):
        service = TwitterBotNamesService([TweetFactory(retweeted_tweet=TweetFactory())])

        text_sources = service.build_text_sources()

        text_sources.should.be.empty
