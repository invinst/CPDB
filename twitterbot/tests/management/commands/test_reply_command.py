from unittest.mock import patch

from django.core.management import call_command

from allegation.factories import OfficerFactory, InvestigatorFactory
from common.tests.core import SimpleTestCase
from common.utils.haystack import rebuild_index
from twitterbot.management.commands.twitter_reply import Command
from twitterbot.models import TwitterSearch, Response


class TwitterReplyCommandTestCase(SimpleTestCase):
    def setUp(self):
        Response(type='officer', message='against').save()
        Response(type='investigator', message='investigated').save()
        self.command = Command()

        rebuild_index()

    def test_officer_reply_format(self):
        officer = OfficerFactory()

        response, _, _ = self.command.create_response(officer.officer_first)

        response.message.should.contain('against')

    def test_investigator_reply_format(self):
        investigator = InvestigatorFactory()

        response, _, _ = self.command.create_response(investigator.name)

        response.message.should.contain('investigated')

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
