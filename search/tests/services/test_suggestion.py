import json

from allegation.factories import OfficerFactory, AllegationCategoryFactory, AllegationFactory
from common.models import AllegationCategory, Officer
from common.tests.core import SimpleTestCase
from search.services.suggestion import Suggestion


class SuggestViewTestCase(SimpleTestCase):
    def setUp(self):
        AllegationCategory.objects.all().delete()
        Officer.objects.all().delete()
        self.suggestion = Suggestion()

    def test_suggest_rank(self):
        rank = 'PO'
        unavailable_rank = 'SGT'
        officer = OfficerFactory(rank=rank)

        self.suggestion.suggest_rank(rank.lower()).should.be.equal([rank])
        self.suggestion.suggest_rank(unavailable_rank.lower()).should.be.equal([])

