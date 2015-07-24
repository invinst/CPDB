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

    def test_suggest_zip_code(self):
        city = 'Chicago IL 60616'
        available_zip_code = '60616'
        unavailable_zip_code = '12345'
        not_digit_term = 'somethingnotdigit'
        AllegationFactory(city=city)

        self.suggestion.suggest_zip_code(available_zip_code).should.be.equal([['60616', city]])
        self.suggestion.suggest_zip_code(unavailable_zip_code).should.be.equal([])
        self.suggestion.suggest_zip_code(not_digit_term).should.be.equal([])
