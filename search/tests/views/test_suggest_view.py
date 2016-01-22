import json
from faker import Faker

from allegation.factories import (
    OfficerFactory, AllegationCategoryFactory, AllegationFactory, AreaFactory)
from common.models import AllegationCategory, Officer
from common.tests.core import SimpleTestCase
from search.factories import AliasFactory, SessionAliasFactory
from search.models import SuggestionLog
from search.models.alias import Alias
from common.utils.haystack import rebuild_index


fake = Faker()


class SuggestViewTestCase(SimpleTestCase):
    def setUp(self):
        AllegationCategory.objects.all().delete()
        Officer.objects.all().delete()

    def get_suggestion(self, term):
        response = self.client.get("/search/suggest/", {
            'term': term
        })
        return json.loads(response.content.decode())

    def test_suggestion_no_query(self):
        response = self.client.get("/search/suggest/", {
            'term': ''
        })
        response.status_code.should.equal(400)

    def test_detect_suggest_type_officer_name(self):
        OfficerFactory(officer_first='Jerry', officer_last="Dao")

        rebuild_index()

        [self.get_suggestion(term).should.contain('Officer') for term in ['je', 'je da']]
        [self.get_suggestion(term).shouldnt.contain('Officer') for term in ['genie', 'je e']]

    def test_detect_suggest_type_officer_badge_number(self):
        OfficerFactory(star=123456)

        rebuild_index()

        data = self.get_suggestion('12')
        data.should.contain('Badge number')

    def test_detect_suggest_type_officer_unit(self):
        self.get_suggestion('71').should.contain('Officer Unit')
        self.get_suggestion('99').shouldnt.contain('Officer Unit')

    def test_detect_suggest_type_officer_unit_name(self):
        self.get_suggestion('Vio').should.contain('Officer Unit')
        self.get_suggestion('Viot').shouldnt.contain('Officer Unit')

    def test_detect_suggest_type_complaint_category(self):
        AllegationCategoryFactory(allegation_name='Bonding category')

        rebuild_index()

        data = self.get_suggestion('Bonding')
        data.should.contain('Allegation type')

    def test_detect_suggest_type_main_complaint_category(self):
        AllegationCategoryFactory(category='Bonding category')

        rebuild_index()

        data = self.get_suggestion('Bonding')
        data.should.contain('Category')

    def test_detect_suggest_type_investigator(self):
        AllegationFactory(investigator__name='Someone Name')

        rebuild_index()

        data = self.get_suggestion('Some')
        data.should.contain('Investigator')

    def test_detect_suggest_type_complaint_id_number(self):
        AllegationFactory(crid=123456)

        rebuild_index()

        data = self.get_suggestion('1234')
        data.should.contain('Allegation ID')

        data = self.get_suggestion('123')
        data.shouldnt.contain('Allegation ID')

        data = self.get_suggestion('8908')
        data.shouldnt.contain('Allegation ID')

    def test_suggest_incident_date_year(self):
        data = self.get_suggestion('20')
        data.should.contain('Incident Year')

        data = self.get_suggestion('19')
        data.shouldnt.contain('Incident Year')

    def test_suggest_incident_date_year_month(self):
        data = self.get_suggestion('2011/1')
        data.should.contain('Incident Year/Month')

        data = self.get_suggestion('2011/3')
        data.shouldnt.contain('Incident Year/Month')

    def test_suggest_incident_date_month_name(self):
        data = self.get_suggestion('Feb')
        data.should.contain('Incident Year/Month')

        data = self.get_suggestion('Feb2')
        data.shouldnt.contain('Incident Year/Month')

    def test_suggest_incident_date(self):
        data = self.get_suggestion('2011/1/1')
        data.should.contain('Incident Date')

        data = self.get_suggestion('2011/1/5')
        data.shouldnt.contain('Incident Date')

    def test_suggest_finding(self):
        data = self.get_suggestion('Unfo')
        data.should.contain('Final Finding')
        data.should.contain('Recommended Finding')

    def test_suggest_officer_rank(self):
        self.get_suggestion('PO').should.contain('Officer Rank')
        self.get_suggestion('invalidrank').shouldnt.contain('Officer Rank')

    def test_suggest_complainant_gender(self):
        data = self.get_suggestion('mal')
        data.should.contain('Complainant Gender')

    def test_suggest_complainant_race(self):
        data = self.get_suggestion('blac')
        data.should.contain('Complainant Race')

    def test_suggest_officer_gender(self):
        data = self.get_suggestion('mal')
        data.should.contain('Officer Gender')

    def test_suggest_officer_race(self):
        data = self.get_suggestion('blac')
        data.should.contain('Officer Race')

    def test_tracking_suggestion(self):
        num = self.num_of_tracked_suggestions()
        self.get_suggestion('anything')
        self.num_of_tracked_suggestions().should.equal(num + 1)

    def num_of_tracked_suggestions(self):
        return SuggestionLog.objects.count()

    def test_suggest_city(self):
        AllegationFactory(city='Chicago IL 60616')

        rebuild_index()

        self.get_suggestion('616')
        self.get_suggestion('616').should.contain('Zip Code')
        self.get_suggestion('123').shouldnt.contain('Zip Code')
        self.get_suggestion('Chi').shouldnt.contain('Zip Code')

    def test_search_with_alias(self):
        officer = OfficerFactory()
        alias = AliasFactory(target=str(officer))

        rebuild_index()

        data = self.get_suggestion(alias.alias[0:2])
        data.should.contain('Officer')

        officer_ids = [x['value'] for x in data['Officer']]
        officer_ids.should.contain('{first} {last}\n'.format(first=officer.officer_first, last=officer.officer_last))

        alias = Alias.objects.get(id=alias.id)
        alias.num_usage.should.equal(1)

    def test_suggest_area_type(self):
        area = AreaFactory()

        rebuild_index()

        data = self.get_suggestion(area.name[0:3])
        data.should.contain('Area')
        data['Area'].should.have.length_of(1)

    def test_search_session_alias(self):
        session_alias = SessionAliasFactory(title=fake.name())

        rebuild_index()

        data = self.get_suggestion(session_alias.alias[0:2])
        data.should.contain('Session')
        [x['label'] for x in data['Session']]\
            .should.contain(session_alias.title)
