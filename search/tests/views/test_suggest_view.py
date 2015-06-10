import json

from allegation.factories import OfficerFactory, AllegationCategoryFactory, ComplaintFactory
from common.models import AllegationCategory, Officer
from common.tests.core import SimpleTestCase


class SuggestViewTestCase(SimpleTestCase):
    def setUp(self):
        AllegationCategory.objects.all().delete()
        Officer.objects.all().delete()

    def get_suggestion(self, term):
        response = self.client.get("/search/suggest/", {
            'term': term
        })
        return json.loads(response.content.decode())

    def test_detect_suggest_type_officer_name(self):
        OfficerFactory(officer_first='Jerry', officer_last="Dao")

        data = self.get_suggestion('je')
        data.should.contain('officer_id')

        data = self.get_suggestion('je da')
        data.should.contain('officer_id')

        data = self.get_suggestion('genie')
        data.shouldnt.contain('officer_id')

    def test_detect_suggest_type_officer_badge_number(self):
        OfficerFactory(star=123456)

        data = self.get_suggestion('12')
        data.should.contain('officer__star')

    def test_detect_suggest_type_complaint_category(self):
        AllegationCategoryFactory(allegation_name='Bonding category')

        data = self.get_suggestion('Bonding')
        data.should.contain('cat')

    def test_detect_suggest_type_main_complaint_category(self):
        AllegationCategoryFactory(category='Bonding category')

        data = self.get_suggestion('Bonding')
        data.should.contain('category')

    def test_detect_suggest_type_investigator(self):
        ComplaintFactory(investigator__name='Someone Name')

        data = self.get_suggestion('Some')
        data.should.contain('investigator')

    def test_detect_suggest_type_complaint_id_number(self):
        ComplaintFactory(crid=123456)

        data = self.get_suggestion('1234')
        data.should.contain('crid')

        data = self.get_suggestion('123')
        data.shouldnt.contain('crid')

        data = self.get_suggestion('8908')
        data.shouldnt.contain('crid')

    def test_suggest_incident_date_year(self):
        data = self.get_suggestion('20')
        data.should.contain('incident_date_only__year')

        data = self.get_suggestion('19')
        data.shouldnt.contain('incident_date_only__year')

    def test_suggest_incident_date_year_month(self):
        data = self.get_suggestion('2011/1')
        data.should.contain('incident_date_only__year_month')

        data = self.get_suggestion('2011/3')
        data.shouldnt.contain('incident_date_only__year_month')

    def test_suggest_incident_date_month_name(self):
        data = self.get_suggestion('Feb')
        data.should.contain('incident_date_only__year_month')

        data = self.get_suggestion('Feb2')
        data.shouldnt.contain('incident_date_only__year_month')

    def test_suggest_incident_date(self):
        data = self.get_suggestion('2011/1/1')
        data.should.contain('incident_date_only')

        data = self.get_suggestion('2011/1/5')
        data.shouldnt.contain('incident_date_only')

    def test_suggest_finding(self):
        data = self.get_suggestion('Unfo')
        data.should.contain('final_finding')
        data.should.contain('recc_finding')
