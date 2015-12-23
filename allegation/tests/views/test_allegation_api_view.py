import datetime
import json

from django.conf import settings
from django.utils import timezone

from allegation.factories import AreaFactory, ComplainingWitnessFactory, AllegationFactory
from allegation.tests.views.base import AllegationApiTestBase
from common.models import Allegation, Officer, Area, RACES, DISCIPLINE_CODES, NO_DISCIPLINE_CODES


class AllegationFilterMixin(object):
    def fetch_allegations(self, **params):
        response = self.client.get('/api/allegations/', params)
        data = json.loads(response.content.decode())
        allegations = data['allegations']
        return allegations

class AllegationApiViewTestCase(AllegationFilterMixin, AllegationApiTestBase):
    def setUp(self):
        self.allegations = AllegationFactory.create_batch(3)

    def test_area_data_filter(self):
        area = AreaFactory()
        response = self.client.get('/api/areas/', {'type': area.type})
        data = json.loads(response.content.decode())
        data.should.contain('features')

        features = data['features']
        for ret_area in features:
            ret_area['properties']['type'].should.equal(area.type)

    def test_fetch_allegation(self):
        AllegationFactory.create_batch(10)
        data = self.fetch_allegations()
        isinstance(data, list).should.be.true
        len(data).should.equal(10)

    def test_fetch_allegation_paging(self):
        allegations = self.fetch_allegations()
        ids = [d['allegation']['id'] for d in allegations]

        allegations = self.fetch_allegations(page=1)
        ids2 = [d['allegation']['id'] for d in allegations]
        (set(ids) & set(ids2)).should.be.empty

        allegations = self.fetch_allegations(page='a')
        ids3 = [d['allegation']['id'] for d in allegations]
        ids.should.equal(ids3)

        allegations = self.fetch_allegations(length=1)
        allegations.should.have.length_of(1)
        allegations = self.fetch_allegations(length='a')
        allegations.should.be.ok

    def test_filter_by_crid(self):
        crid = self.allegations[0].crid
        data = self.fetch_allegations(crid=crid)
        for row in data:
            int(row['allegation']['crid']).should.equal(crid)

    def test_filter_by_category(self):
        cat = self.allegations[0].cat
        data = self.fetch_allegations(cat__cat_id=cat.cat_id)
        for row in data:
            row['category']['allegation_name'].should.equal(cat.allegation_name)

    def test_filter_by_main_category(self):
        cat = self.allegations[0].cat
        data = self.fetch_allegations(cat__category=cat.category)
        for row in data:
            row['category']['category'].should.equal(cat.category)

    def test_filter_by_officer_id(self):
        pk = self.allegations[0].officer.pk
        data = self.fetch_allegations(officer=pk)

        for row in data:
            row['officer']['id'].should.equal(pk)

    def test_filter_by_officer_first(self):
        officer = self.allegations[0].officer
        officer_part = officer.officer_first[0:2]
        data = self.fetch_allegations(officer_name=officer_part)

        for row in data:
            check_names = "%s %s" % (row['officer']['officer_first'], row['officer']['officer_last'])
            check_names.should.contain(officer_part)

    def test_officer_profile_url(self):
        cat = self.allegations[0].cat
        data = self.fetch_allegations(cat=cat.cat_id)
        for allegation in data:
            officer_json = allegation['officer']
            officer = Officer.objects.get(pk=officer_json['id'])
            officer_json['absolute_url'].should.equal(officer.get_absolute_url())

    def test_filter_by_investigator(self):
        investigator = self.allegations[0].investigator
        data = self.fetch_allegations(investigator=investigator.id)

        for row in data:
            row['allegation']['investigator']['pk'].should.equal(investigator.pk)

    def test_filter_by_final_outcome(self):
        AllegationFactory(final_outcome=600)
        data = self.fetch_allegations(final_outcome=600)
        for row in data:
            Allegation.objects.filter(pk=row['allegation']['id'], final_outcome=600).exists().should.be.true

    def test_filter_by_date_range(self):
        start_date = timezone.now().date()
        end_date = start_date + datetime.timedelta(days=3)
        for hours in range(1, 4):
            AllegationFactory(incident_date=start_date + datetime.timedelta(hours=hours))
        response_format = "%Y-%m-%d %H:%M:%S"

        def happen_between(row):
            incident_date = datetime.datetime.strptime(row['allegation']['incident_date'], response_format).date()
            return end_date >= incident_date >= start_date

        start_date_str = start_date.strftime("%Y-%m-%d")
        end_date_str = end_date.strftime("%Y-%m-%d")

        allegations = self.fetch_allegations(incident_date_only__range="%s,%s" % (start_date_str, end_date_str))
        for allegation in allegations:
            happen_between(allegation).should.be.true

        allegations = self.fetch_allegations(incident_date_only__year=start_date.year)
        for allegation in allegations:
            year = datetime.datetime.strptime(allegation['allegation']['incident_date'], response_format).year
            year.should.equal(start_date.year)

        allegations = self.fetch_allegations(incident_date_only__year_month=start_date.strftime("%Y-%m"))
        for allegation in allegations:
            date = datetime.datetime.strptime(allegation['allegation']['incident_date'], response_format)
            date.year.should.equal(start_date.year)
            date.month.should.equal(start_date.month)

        allegations = self.fetch_allegations(incident_date_only=start_date.strftime("%Y-%m-%d"))
        for allegation in allegations:
            date = datetime.datetime.strptime(allegation['allegation']['incident_date'], response_format).date()
            date.should.equal(start_date)

    def test_multiple_areas(self):
        areas = Area.objects.filter()
        num_allegations = len(Allegation.objects.filter(areas=areas).distinct().values('crid'))
        allegations = self.fetch_allegations(areas__id=list(areas.values_list('pk', flat=True)))
        num_returned = len(allegations)
        num_returned.should.equal(getattr(settings, 'ALLEGATION_LIST_ITEM_COUNT', 200))

    def test_filter_by_complaint_gender(self):
        allegation = self.allegations[0]
        ComplainingWitnessFactory.create_batch(3, crid=allegation.crid)
        data = self.fetch_allegations(complainant_gender='M')
        for row in data:
            genders = [x['gender'] for x in row['complaining_witness']]
            genders.should.contain('M')

    def test_filter_by_both_complaint_gender(self):
        allegation = self.allegations[0]
        ComplainingWitnessFactory.create_batch(3, crid=allegation.crid)
        data = self.fetch_allegations(complainant_gender=['M', 'F'])
        for row in data:
            genders = [x['gender'] for x in row['complaining_witness']]
            genders.should.be.ok

    def test_filter_by_complaint_race(self):
        allegation = self.allegations[0]
        witnesses = ComplainingWitnessFactory.create_batch(3, crid=allegation.crid)
        race = witnesses[0].race
        data = self.fetch_allegations(complainant_race=race)
        for row in data:
            races = [x['race'] for x in row['complaining_witness']]
            races.should.contain(race)

    def test_filter_by_officer_gender(self):
        officer = self.allegations[0].officer
        officer.gender = 'M'
        officer.save()

        data = self.fetch_allegations(officer__gender='M')
        for row in data:
            row['officer']['gender'].should.equal('M')

    def test_filter_by_officer_race(self):
        race = self.allegations[0].officer.race
        data = self.fetch_allegations(officer__race=race)
        for row in data:
            row['officer']['race'].should.equal(race)

    def test_investigator_data(self):
        data = self.fetch_allegations()
        data.should.be.ok
        for row in data:
            row.should.contain('investigator')

    def test_filter_by_outcome_group(self):
        AllegationFactory(final_finding='SU', final_outcome=DISCIPLINE_CODES[0])
        AllegationFactory(final_finding='SU', final_outcome=NO_DISCIPLINE_CODES[0])
        data = self.fetch_allegations(outcome_text='any discipline')
        for row in data:
            allegation = Allegation.objects.get(pk=row['allegation']['id'])
            allegation.final_outcome.should.be.within(DISCIPLINE_CODES)
            allegation.final_finding.should.equal('SU')

        data = self.fetch_allegations(outcome_text='no discipline')
        for row in data:
            allegation = Allegation.objects.get(pk=row['allegation']['id'])
            allegation.final_outcome.should.be.within(NO_DISCIPLINE_CODES)
            allegation.final_finding.should.equal('SU')

    def test_filter_by_finding_text(self):
        data = self.fetch_allegations(final_finding_text='unsustained')
        for row in data:
            allegation = Allegation.objects.get(pk=row['allegation']['id'])
            allegation.final_finding.shouldnt.equal('SU')
