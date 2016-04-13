from mock import patch

from common.utils.haystack import rebuild_index

from allegation.factories import OfficerFactory, InvestigatorFactory
from common.tests.core import SimpleTestCase
from twitterbot.factories import ResponseTemplateFactory
from twitterbot.services.twitter_bot_responses_service import TwitterBotResponsesService


class TwitterBotResponsesServiceTestCase(SimpleTestCase):
    def setUp(self):
        ResponseTemplateFactory(response_type='officer', message='{{obj.display_name}}')
        ResponseTemplateFactory(response_type='investigator', message='{{obj.name}}')

    def test_build_responses(self):
        officer = OfficerFactory(officer_first='Jason', officer_last='Van Dyke')
        investigator = InvestigatorFactory(name='Daniel Neubeck')
        names = ['Jason Van Dyke', 'Daniel Neubeck']

        rebuild_index()

        responses = TwitterBotResponsesService(names).build_responses()
        responses_str = str(responses)

        responses_str.should.contain(officer.display_name)
        responses_str.should.contain(investigator.name)

    def test_limit_responses_return(self):
        with patch('twitterbot.services.responses.officers.OfficerResponses.build_responses',
                   return_value=list(range(20))):
            responses = TwitterBotResponsesService([]).build_responses()
            len(responses).should.equal(10)
