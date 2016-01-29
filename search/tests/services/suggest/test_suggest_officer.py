from allegation.factories import OfficerFactory
from search.services.suggest.suggest_officer import (
    SuggestOfficerName, SuggestOfficerUnit, SuggestOfficerStar, SuggestOfficerRank,
    SuggestOfficerActive)
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

        SuggestOfficerName.query('Mich')['Officer'][0]['label'].should.be.equal(expect_suggest)
        SuggestOfficerName.query('olford')['Officer'][0]['label'].should.be.equal(expect_suggest)
        SuggestOfficerName.query('Bad')['Officer'].should.be.equal([])

    def test_suggest_officer_star(self):
        officer = OfficerFactory(star=110910)

        self.rebuild_index()

        SuggestOfficerStar.query('1109')['Badge number'][0]['value'].should.be.equal(officer.star)
        SuggestOfficerStar.query('1090')['Badge number'].should.be.equal([])
        SuggestOfficerStar.query('notdigit').should.be.equal(None)

    def test_suggest_officer_unit(self):
        SuggestOfficerUnit.query('independent')['Officer Unit'][0]['label']\
            .should.be.equal('Independent Police Review Authority (IPRA)')
        SuggestOfficerUnit.query('113')['Officer Unit'][0]['label']\
            .should.be.equal('Independent Police Review Authority (IPRA)')
        SuggestOfficerUnit.query('not in suggest')['Officer Unit'].should.be.equal([])

    def test_suggest_officer_rank(self):
        SuggestOfficerRank.query('training')['Officer Rank'][0]['label'].should.be.equal('Field Training Officer')
        SuggestOfficerRank.query('FTO')['Officer Rank'].should.be.equal([])

    def test_suggest_officer_active(self):
        SuggestOfficerActive.query('Active')['Officer Employment Status'][0]['label'].should.be.equal('Active')
        SuggestOfficerActive.query('Inactive')['Officer Employment Status'][0]['label'].should.be.equal('Inactive')
