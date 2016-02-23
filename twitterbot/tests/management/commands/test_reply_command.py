from unittest.mock import patch

from django.core.management import call_command

from allegation.factories import OfficerFactory, InvestigatorFactory
from common.tests.core import SimpleTestCase
from common.utils.haystack import rebuild_index
from twitterbot.management.commands.twitter_reply import Command
from twitterbot.models import TwitterSearch, Response, TwitterResponse


class TwitterReplyCommandTestCase(SimpleTestCase):
    def setUp(self):
        Response(type='officer', message='against').save()
        Response(type='investigator', message='investigated').save()
        self.command = Command()

        rebuild_index()

    def test_officer_reply_format(self):
        officer = OfficerFactory()

        responses = self.command.create_responses(officer.officer_first)

        responses[0][0].message.should.contain('against')

    def test_investigator_reply_format(self):
        investigator = InvestigatorFactory()

        responses = self.command.create_responses(investigator.name)

        responses[0][0].message.should.contain('investigated')

    def test_update_refresh_url(self):
        search = TwitterSearch()
        search.save()
        refresh_url = search.refresh_url

        with patch('twitterbot.models.TwitterSearch.search', return_value={
            'search_metadata': {'refresh_url': 'abc'}
        }):
            call_command('twitter_reply')
            search.refresh_from_db()
            search.refresh_url.shouldnt.equal(refresh_url)

    def test_url_in_response(self):
        response = 'Officer http://cpdb.co/officer/123 has'
        correct_format = 'Officer%20http%3A%2F%2Fcpdb.co%2Fofficer%2F123%20has'

        escaped = TwitterResponse.escape_response(response)

        escaped.should.equal(correct_format)

    def test_multiple_responses(self):
        officer = OfficerFactory(officer_first='First')
        InvestigatorFactory(name='First Last')

        responses = self.command.create_responses(officer.officer_first)

        responses[0][0].message.should.contain('investigated')
        responses[1][0].message.should.contain('against')

    def test_link_parsing_retrieval(self):
        TwitterResponse.objects.all().delete()
        TwitterSearch.objects.create(query='#CPDB')
        ret = {
            'statuses': [
                {'text': '#CPDB Some text http://www.truth-out.org/news/item/26986-amid-'
                         'shootings-chicago-police-department-upholds-culture-of-impunity',
                 'user': {'screen_name': 'anyone'}}]
        }
        with patch('twitterbot.models.TwitterSearch.search', return_value=ret):
            call_command('twitter_reply')
            TwitterResponse.objects.filter().exists().should.be.true
