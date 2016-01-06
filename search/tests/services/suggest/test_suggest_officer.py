from allegation.factories import AllegationFactory, OfficerFactory
from search.services.suggest.suggest_officer import SuggestOfficerName, SuggestOfficerUnit, SuggestOfficerStar, SuggestOfficerRank
from search.tests.services.suggest.test_suggest_base import SuggestBaseTestCase


class SuggestOfficerTestCase(SuggestBaseTestCase):
    def test_suggest_officer_name(self):
        officer = OfficerFactory(officer_first='Michael', officer_last='Molford')

        self.rebuild_index()

        expect_suggest = '{first_name} {last_name}\n ({allegations_count})'.format(
            first_name=officer.officer_first,
            last_name=officer.officer_last,
            allegations_count=officer.allegations_count
        )

        SuggestOfficerName.query('Mich')['officer'].should.be.equal([ (expect_suggest, officer.id) ])
        SuggestOfficerName.query('olford')['officer'].should.be.equal([ (expect_suggest, officer.id) ])
        SuggestOfficerName.query('Bad')['officer'].should.be.equal([])

    def test_suggest_officer_star(self):
        officer = OfficerFactory(star=110910)

        self.rebuild_index()

        SuggestOfficerStar.query('1109')['officer__star'].should.be.equal([officer.star])
        SuggestOfficerStar.query('1090')['officer__star'].should.be.equal([])
        SuggestOfficerStar.query('notdigit').should.be.equal(None)

    def test_suggest_officer_unit(self):
        SuggestOfficerUnit.query('independent')['officer__unit'].should.be.equal([['Independent Police Review Authority (IPRA)', '113']])
        SuggestOfficerUnit.query('113')['officer__unit'].should.be.equal([['Independent Police Review Authority (IPRA)', '113']])
        SuggestOfficerUnit.query('not in suggest')['officer__unit'].should.be.equal([])

    def test_suggest_officer_rank(self):
        SuggestOfficerRank.query('training')['officer__rank'].should.be.equal([['Field Training Officer', 'FTO']])
        SuggestOfficerRank.query('FTO')['officer__rank'].should.be.equal([])
