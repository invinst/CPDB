from unittest.mock import MagicMock

from mock import patch

from allegation.factories import OfficerFactory
from common.tests.core import SimpleTestCase
from twitterbot.factories import ResponseTemplateFactory
from twitterbot.services.responses.base import BaseResponses


class BaseResponsesTestCase(SimpleTestCase):
    def test_implement_get_instances_from_names(self):
        self.assertRaises(NotImplementedError, BaseResponses([]).get_instances_from_names)

    def test_build_responses(self):
        ResponseTemplateFactory(response_type='officer', message='{{obj.display_name}}')
        officer = OfficerFactory(officer_first='John', officer_last='Doe')

        responses = BaseResponses([])
        responses.RESPONSE_TYPE = 'officer'
        responses.get_instances_from_names = MagicMock(return_value=[officer])
        messages = responses.build_responses()

        len(messages).should.equal(1)
        messages[0].should.contain(officer.display_name)

    def test_build_responses_log_not_existed_response_error(self):
        expected_error = 'Response type officer does not exist in database'

        with patch('twitterbot.services.responses.base.logging.error') as mock_logging:
            responses = BaseResponses([])
            responses.RESPONSE_TYPE = 'officer'
            responses.get_instances_from_names = MagicMock(return_value=[OfficerFactory()])
            responses.build_responses()

            mock_logging.assert_called_once_with(expected_error)
