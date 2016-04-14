from allegation.factories import (
    AllegationFactory, OfficerFactory, OfficerAllegationFactory)
from common.tests.core import SimpleTestCase
from mobile.services.mobile_suggestion_service import suggest_crid, suggest_officer_star, suggest_officer_name


class MobileSuggestionServiceTest(SimpleTestCase):
    def test_suggest_crid(self):
        allegation = AllegationFactory(crid='1051333')
        OfficerAllegationFactory(allegation=allegation)
        OfficerAllegationFactory(allegation=AllegationFactory(crid='306697'))

        crid = str(allegation.crid)
        partial_query = crid[0:3]

        suggest_crid(partial_query).should.equal([])

        expected_allegation = allegation.as_suggestion_entry()
        allegation_result = suggest_crid(crid)
        allegation_result[0]['meta']['allegation'].incident_date = \
            allegation_result[0]['meta']['allegation'].incident_date.date()
        allegation_result.should.equal([expected_allegation])

    def test_suggest_officer_badge(self):
        officer = OfficerFactory(star=19663)
        OfficerFactory(star=17489)

        star = str(officer.star)
        partial_query = star[0:2]
        bad_query = 'bad-query'

        suggest_officer_star(partial_query).should.equal([])
        suggest_officer_star(bad_query).should.equal([])
        suggest_officer_star(star).should.equal(
            [officer.as_suggestion_entry()])

    def test_suggest_officer_name(self):
        officer = OfficerFactory(officer_first='Test', officer_last='Name')
        OfficerFactory(officer_first='Other', officer_last='Bad')

        query_for_first_name = officer.officer_first[0:2]
        query_for_last_name = officer.officer_last[0:2]
        non_matched = 'nonmatchquery'

        len(suggest_officer_name(query_for_first_name)).should.equal(1)
        len(suggest_officer_name(query_for_last_name)).should.equal(1)
        len(suggest_officer_name(non_matched)).should.equal(0)

    def test_order_officer_by_number_of_complaints(self):
        officer_name = 'matched'
        officer_1 = OfficerFactory(
            officer_first=officer_name, allegations_count=1)
        officer_2 = OfficerFactory(
            officer_first=officer_name, allegations_count=3)
        officer_3 = OfficerFactory(
            officer_first=officer_name, allegations_count=2)

        officers = suggest_officer_name(officer_name)

        ordered_officer_keys = [officer_2.pk, officer_3.pk, officer_1.pk]
        officer_allegation_counts = [x['resource_key'] for x in officers]
        officer_allegation_counts.should.equal(ordered_officer_keys)
