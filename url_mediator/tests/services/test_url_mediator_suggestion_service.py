from collections import OrderedDict

from mock import MagicMock

from common.tests.core import SimpleTestCase
from url_mediator.services.url_mediator_suggestion_service import UrlMediatorSuggestionService


class UrlMediatorSuggestionServiceTest(SimpleTestCase):
    def test_pick_best_match(self):
        ordered_dict = OrderedDict({
            'key': ['firstValue', 'secondValue'],
        })
        url_mediator_suggestion_service = UrlMediatorSuggestionService()
        url_mediator_suggestion_service.make_suggestion = MagicMock(return_value=ordered_dict)

        result = url_mediator_suggestion_service.pick_the_best_matched_for('test')
        result.should.be.equal(OrderedDict({
            'key': ['firstValue'],
        }))
