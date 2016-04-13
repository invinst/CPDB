from mock import patch

from common.utils.haystack import rebuild_index

from allegation.factories import OfficerFactory
from common.tests.core import SimpleTestCase
from twitterbot.factories import ResponseTemplateFactory
from twitterbot.services.twitter_bot_responses_service import TwitterBotResponsesService


class TwitterBotResponsesServiceTestCase(SimpleTestCase):
    def setUp(self):
        ResponseTemplateFactory(response_type='officer', message='{{obj.display_name}}')
        ResponseTemplateFactory(response_type='investigator', message='{{obj.name}}')

    def test_build_responses(self):
        officer = OfficerFactory(officer_first='Jason', officer_last='Van Dyke')
        # Temporary disable investigator response since mobile version doesn't have investigator page yet
        # investigator = InvestigatorFactory(name='Daniel Neubeck')
        names = {
            'Jason Van Dyke': [],
            'Daniel Neubeck': []
        }

        rebuild_index()

        responses = TwitterBotResponsesService(names).build_responses()
        responses_str = [x.message for x in responses]

        responses_str.should.contain(officer.display_name)
        # Temporary disable investigator response since mobile version doesn't have investigator page yet
        # responses_str.should.contain(investigator.name)

    def test_limit_responses_return(self):
        with patch('twitterbot.services.responses.officers.OfficerResponses.build_responses',
                   return_value=list(range(20))):
            responses = TwitterBotResponsesService({}).build_responses()
            len(responses).should.equal(10)
