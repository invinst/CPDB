from allegation.factories import AllegationFactory
from search.services.suggest.suggest_allegation import SuggestAllegationCity, SuggestAllegationCrid
from search.tests.services.suggest.base_test_suggest import BaseSuggestTestCase


class AllegationSuggestTestCase(BaseSuggestTestCase):
    def test_suggest_zip_code(self):
        city = 'Chicago IL 60616'
        available_zip_code = '60616'
        unavailable_zip_code = '12345'
        not_digit_term = 'somethingnotdigit'

        AllegationFactory(city=city)

        self.rebuild_index()

        suggest_entry = SuggestAllegationCity.query(available_zip_code)['Zip Code'][0]
        suggest_entry['suggest_value'].should.be.equal(available_zip_code)
        suggest_entry['tag_value']['display_value'].should.be.equal(city)
        SuggestAllegationCity.query(unavailable_zip_code)['Zip Code'].should.be.equal([])
        SuggestAllegationCity.query(not_digit_term).should.be.equal(None)

    def test_suggest_zip_code_distinct(self):
        city1 = 'Chicago IL 60616'
        city2 = 'CHICAGO, IL 60616'
        available_zip_code = '60616'
        AllegationFactory(city=city1)
        AllegationFactory(city=city2)

        self.rebuild_index()

        len(SuggestAllegationCity.query(available_zip_code)).should.equal(1)

    def test_suggest_crid(self):
        allegation_crid = '1002101'
        crids = [allegation_crid, 'cr 1002101', 'CR 1002101', 'cr1002101', 'crid 1002101']
        unavailable_crid = '10111111'
        not_numerics = ['not_numeric', 'cr not_numeric']
        AllegationFactory(crid=allegation_crid)

        self.rebuild_index()

        for crid in crids:
            SuggestAllegationCrid.query(crid)['Allegation ID'][0]['suggest_value'].should.be.equal(allegation_crid)
        SuggestAllegationCrid.query(unavailable_crid)['Allegation ID'].should.be.equal([])
        for not_numeric in not_numerics:
            SuggestAllegationCrid.query(not_numeric).should.be.equal(None)
