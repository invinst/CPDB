import json

from allegation.factories import OfficerFactory, AllegationCategoryFactory, AllegationFactory
from common.models import AllegationCategory, Officer
from common.tests.core import SimpleTestCase
from search.services.suggestion import Suggestion
from search.factories import AliasFactory


class SuggestViewTestCase(SimpleTestCase):
    def setUp(self):
        AllegationCategory.objects.all().delete()
        Officer.objects.all().delete()
        self.suggestion = Suggestion()

    def test_suggest_zip_code(self):
        city = 'Chicago IL 60616'
        available_zip_code = '60616'
        unavailable_zip_code = '12345'
        not_digit_term = 'somethingnotdigit'
        AllegationFactory(city=city)

        self.suggestion.suggest_zip_code(available_zip_code).should.be.equal([['60616', city]])
        self.suggestion.suggest_zip_code(unavailable_zip_code).should.be.equal([])
        self.suggestion.suggest_zip_code(not_digit_term).should.be.equal([])

    def test_suggest_zip_code_distinct(self):
        city1 = 'Chicago IL 60616'
        city2 = 'CHICAGO, IL 60616'
        available_zip_code = '60616'
        AllegationFactory(city=city1)
        AllegationFactory(city=city2)
        len(self.suggestion.suggest_zip_code(available_zip_code)).should.equal(1)

    def test_month_year_suggestion_by_month_name(self):
        self.suggestion.suggest_incident_year_month('feb').should.equal([
            ['February 2010', '2010-2'], ['February 2011', '2011-2'], ['February 2012', '2012-2'],
            ['February 2013', '2013-2'], ['February 2014', '2014-2'], ['February 2015', '2015-2'],
        ])

    def test_suggest_custom_defined_text(self):
        data = self.suggestion.make_suggestion('discipline')
        data.should.contain('outcome_text')

    def test_make_suggestion_with_alias(self):
        AliasFactory(alias='any', target='no')
        data = self.suggestion.make_suggestion('discipline')
        data['outcome_text'].should.have.length_of(2)
        values = [x[1] for x in data['outcome_text']]
        values.should.equal(['no discipline', 'any discipline'])
