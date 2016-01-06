from allegation.factories import AllegationFactory
from search.services.suggest.suggest_allegation import SuggestAllegationCity, SuggestAllegationCrid
from search.tests.services.suggest.test_suggest_base import SuggestBaseTestCase


class SuggestAllegationTestCase(SuggestBaseTestCase):
    def test_suggest_zip_code(self):
        city = 'Chicago IL 60616'
        available_zip_code = '60616'
        unavailable_zip_code = '12345'
        not_digit_term = 'somethingnotdigit'

        AllegationFactory(city=city)

        SuggestAllegationCity.query(available_zip_code)['city'].should.be.equal([['60616', city]])
        SuggestAllegationCity.query(unavailable_zip_code)['city'].should.be.equal([])
        SuggestAllegationCity.query(not_digit_term).should.be.equal(None)

    def test_suggest_zip_code_distinct(self):
        city1 = 'Chicago IL 60616'
        city2 = 'CHICAGO, IL 60616'
        available_zip_code = '60616'
        AllegationFactory(city=city1)
        AllegationFactory(city=city2)

        len(SuggestAllegationCity.query(available_zip_code)).should.equal(1)

    def test_suggest_crid(self):
        crid = '1002101'
        unavailable_crid = '10111111'
        not_numeric = 'not_numeric'
        AllegationFactory(crid=crid)

        self.rebuild_index()

        SuggestAllegationCrid.query('1002')['allegation__crid'].should.be.equal([crid])
        SuggestAllegationCrid.query(unavailable_crid)['allegation__crid'].should.be.equal([])
        SuggestAllegationCrid.query(not_numeric).should.be.equal(None)
