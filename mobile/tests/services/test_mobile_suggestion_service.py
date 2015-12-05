from allegation.factories import AllegationFactory, OfficerFactory
from mobile.services.mobile_suggestion_service import MobileSuggestionService

from common.models import Allegation
from common.models import Officer
from common.tests.core import SimpleTestCase


class MobileSuggestionServiceTest(SimpleTestCase):
    def setUp(self):
        self.mobile_suggestion = MobileSuggestionService()
        Allegation.objects.all().delete()
        Officer.objects.all().delete()

    def test_suggest_crid(self):
        allegation = AllegationFactory(crid='1051333')
        AllegationFactory(crid='306697')

        crid = str(allegation.crid)
        partial_query = crid[0:3]

        self.mobile_suggestion.suggest_crid(partial_query).should.equal(None)
        self.mobile_suggestion.suggest_crid(crid).should.equal(allegation)

    def test_suggest_officer(self):
        officer = OfficerFactory(star=19663)
        OfficerFactory(star=17489)

        star = str(officer.star)
        partial_query = star[0:2]
        bad_query = 'bad-query'

        self.mobile_suggestion.suggest_officer_star(partial_query).should.equal(None)
        self.mobile_suggestion.suggest_officer_star(bad_query).should.equal(None)
        self.mobile_suggestion.suggest_officer_star(star).should.equal(officer)

    def test_suggest_officer_name(self):
        officer = OfficerFactory(officer_first='Test', officer_last='Name')
        OfficerFactory(officer_first='Other', officer_last='Bad')

        query_for_first_name = officer.officer_first[0:2]
        query_for_last_name = officer.officer_last[0:2]
        non_matched = 'nonmatchquery'

        len(self.mobile_suggestion.suggest_officer_name(query_for_first_name)).should.equal(1)
        len(self.mobile_suggestion.suggest_officer_name(query_for_last_name)).should.equal(1)
        len(self.mobile_suggestion.suggest_officer_name(non_matched)).should.equal(0)

    def test_order_officer_by_number_of_complaints(self):
        officer_name = 'matched'
        OfficerFactory(officer_first=officer_name, allegations_count=1)
        OfficerFactory(officer_first=officer_name, allegations_count=3)
        OfficerFactory(officer_first=officer_name, allegations_count=2)

        officers = self.mobile_suggestion.suggest_officer_name(officer_name)
        officer_alligation_counts = [x.allegations_count for x in officers]
        officer_alligation_counts.should.equal([3, 2, 1])
