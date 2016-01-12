import datetime
import json

from django.conf import settings
from django.utils import timezone

from allegation.factories import (
    AreaFactory, ComplainingWitnessFactory, AllegationFactory,
    OfficerAllegationFactory)
from allegation.tests.views.base import OfficerAllegationApiTestBase
from common.models import (
    Allegation, Officer, Area, DISCIPLINE_CODES, NO_DISCIPLINE_CODES,
    OfficerAllegation)


class OfficerAllegationFilterMixin(object):
    def fetch_officer_allegations(self, **params):
        response = self.client.get('/api/officer-allegations/', params)
        data = json.loads(response.content.decode())
        officer_allegations = data['officer_allegations']
        return officer_allegations


class OfficerAllegationApiViewTestCase(
        OfficerAllegationFilterMixin, OfficerAllegationApiTestBase):
    def setUp(self):
        self.officer_allegations = OfficerAllegationFactory.create_batch(3)

    def test_area_data_filter(self):
        area = AreaFactory()
        response = self.client.get('/api/areas/', {'type': area.type})
        data = json.loads(response.content.decode())
        data.should.contain('features')

        features = data['features']
        for ret_area in features:
            ret_area['properties']['type'].should.equal(area.type)

    def test_fetch_officer_allegation(self):
        OfficerAllegationFactory.create_batch(10)
        data = self.fetch_officer_allegations()
        isinstance(data, list).should.be.true
        len(data).should.equal(10)

    def test_fetch_officer_allegation_paging(self):
        allegations = self.fetch_officer_allegations()
        ids = [d['allegation']['id'] for d in allegations]

        allegations = self.fetch_officer_allegations(page=1)
        ids2 = [d['allegation']['id'] for d in allegations]
        (set(ids) & set(ids2)).should.be.empty

        allegations = self.fetch_officer_allegations(page='a')
        ids3 = [d['allegation']['id'] for d in allegations]
        ids.should.equal(ids3)

        allegations = self.fetch_officer_allegations(length=1)
        allegations.should.have.length_of(1)
        allegations = self.fetch_officer_allegations(length='a')
        allegations.should.be.ok

    def test_filter_by_crid(self):
        crid = self.officer_allegations[0].allegation.crid
        data = self.fetch_officer_allegations(allegation__crid=crid)
        for row in data:
            int(row['allegation']['crid']).should.equal(crid)

    def test_filter_by_category(self):
        cat = self.officer_allegations[0].cat
        data = self.fetch_officer_allegations(cat__cat_id=cat.cat_id)
        for row in data:
            row['category']['allegation_name']\
                .should.equal(cat.allegation_name)

    def test_filter_by_main_category(self):
        cat = self.officer_allegations[0].cat
        data = self.fetch_officer_allegations(cat__category=cat.category)
        for row in data:
            row['category']['category'].should.equal(cat.category)

    def test_filter_by_officer_id(self):
        pk = self.officer_allegations[0].officer.pk
        data = self.fetch_officer_allegations(officer=pk)

        for row in data:
            row['officer']['id'].should.equal(pk)

    def test_filter_by_officer_first(self):
        officer = self.officer_allegations[0].officer
        officer_part = officer.officer_first[0:2]
        data = self.fetch_officer_allegations(officer_name=officer_part)

        for row in data:
            check_names = "%s %s" % (
                row['officer']['officer_first'],
                row['officer']['officer_last'])
            check_names.should.contain(officer_part)

    def test_officer_profile_url(self):
        cat = self.officer_allegations[0].cat
        data = self.fetch_officer_allegations(cat__cat_id=cat.cat_id)
        for allegation in data:
            officer_json = allegation['officer']
            officer = Officer.objects.get(pk=officer_json['id'])
            officer_json['absolute_url']\
                .should.equal(officer.get_absolute_url())

    def test_filter_by_investigator(self):
        investigator = self.officer_allegations[0].allegation.investigator
        data = self.fetch_officer_allegations(allegation__investigator=investigator.id)

        for row in data:
            row['allegation']['investigator']['pk']\
                .should.equal(investigator.pk)

    def test_filter_by_final_outcome(self):
        OfficerAllegationFactory(final_outcome=600)
        data = self.fetch_officer_allegations(final_outcome=600)
        for row in data:
            OfficerAllegation.objects.filter(
                pk=row['officer_allegation']['id'], final_outcome=600)\
                .exists().should.be.true

    def test_filter_by_date_range(self):
        start_date = timezone.now().date()
        end_date = start_date + datetime.timedelta(days=3)
        for hours in range(1, 4):
            allegation = AllegationFactory(
                incident_date=start_date + datetime.timedelta(hours=hours))
            OfficerAllegationFactory(allegation=allegation)
        response_format = "%Y-%m-%d %H:%M:%S"

        def happen_between(row):
            incident_date = datetime.datetime.strptime(
                row['allegation']['incident_date'], response_format).date()
            return end_date >= incident_date >= start_date

        start_date_str = start_date.strftime("%Y-%m-%d")
        end_date_str = end_date.strftime("%Y-%m-%d")

        allegations = self.fetch_officer_allegations(
            incident_date_only__range="%s,%s" % (start_date_str, end_date_str))
        for allegation in allegations:
            happen_between(allegation).should.be.true

        allegations = self.fetch_officer_allegations(
            incident_date_only__year=start_date.year)
        for allegation in allegations:
            year = datetime.datetime.strptime(
                allegation['allegation']['incident_date'],
                response_format).year
            year.should.equal(start_date.year)

        allegations = self.fetch_officer_allegations(
            incident_date_only__year_month=start_date.strftime("%Y-%m"))
        for allegation in allegations:
            date = datetime.datetime.strptime(
                allegation['allegation']['incident_date'], response_format)
            date.year.should.equal(start_date.year)
            date.month.should.equal(start_date.month)

        allegations = self.fetch_officer_allegations(
            incident_date_only=start_date.strftime("%Y-%m-%d"))
        for allegation in allegations:
            date = datetime.datetime.strptime(
                allegation['allegation']['incident_date'],
                response_format).date()
            date.should.equal(start_date)

    def test_multiple_areas(self):
        areas = Area.objects.all()
        allegations = self.fetch_officer_allegations(
            allegation__areas__id=list(areas.values_list('pk', flat=True)))
        num_returned = len(allegations)
        num_returned.should.equal(
            getattr(settings, 'ALLEGATION_LIST_ITEM_COUNT', 200))

    def test_filter_by_complaint_gender(self):
        allegation = self.officer_allegations[0].allegation
        ComplainingWitnessFactory.create_batch(3, crid=allegation.crid)
        data = self.fetch_officer_allegations(complainant_gender='M')
        for row in data:
            genders = [x['gender'] for x in row['complaining_witness']]
            genders.should.contain('M')

    def test_filter_by_both_complaint_gender(self):
        allegation = self.officer_allegations[0].allegation
        ComplainingWitnessFactory.create_batch(3, crid=allegation.crid)
        data = self.fetch_officer_allegations(complainant_gender=['M', 'F'])
        for row in data:
            genders = [x['gender'] for x in row['complaining_witness']]
            genders.should.be.ok

    def test_filter_by_complaint_race(self):
        allegation = self.officer_allegations[0].allegation
        witnesses = ComplainingWitnessFactory.create_batch(
            3, crid=allegation.crid)
        race = witnesses[0].race
        data = self.fetch_officer_allegations(complainant_race=race)
        for row in data:
            races = [x['race'] for x in row['complaining_witness']]
            races.should.contain(race)

    def test_filter_by_officer_gender(self):
        officer = self.officer_allegations[0].officer
        officer.gender = 'M'
        officer.save()

        data = self.fetch_officer_allegations(officer__gender='M')
        for row in data:
            row['officer']['gender'].should.equal('M')

    def test_filter_by_officer_race(self):
        race = self.officer_allegations[0].officer.race
        data = self.fetch_officer_allegations(officer__race=race)
        for row in data:
            row['officer']['race'].should.equal(race)

    def test_investigator_data(self):
        data = self.fetch_officer_allegations()
        data.should.be.ok
        for row in data:
            row.should.contain('investigator')

    def test_filter_by_outcome_group(self):
        OfficerAllegationFactory(
            final_finding='SU', final_outcome=DISCIPLINE_CODES[0])
        OfficerAllegationFactory(
            final_finding='SU', final_outcome=NO_DISCIPLINE_CODES[0])
        data = self.fetch_officer_allegations(outcome_text='any discipline')
        for row in data:
            officer_allegation = OfficerAllegation.objects.get(
                pk=row['officer_allegation']['id'])
            officer_allegation.final_outcome.should.be.within(DISCIPLINE_CODES)
            officer_allegation.final_finding.should.equal('SU')

        data = self.fetch_officer_allegations(outcome_text='no discipline')
        for row in data:
            officer_allegation = OfficerAllegation.objects.get(
                pk=row['officer_allegation']['id'])
            officer_allegation.final_outcome.should.be.within(
                NO_DISCIPLINE_CODES)
            officer_allegation.final_finding.should.equal('SU')

    def test_filter_by_finding_text(self):
        data = self.fetch_officer_allegations(final_finding_text='unsustained')
        for row in data:
            officer_allegation = OfficerAllegation.objects.get(
                pk=row['officer_allegation']['id'])
            officer_allegation.final_finding.shouldnt.equal('SU')

    def test_filter_by_has_document(self):
        allegation = AllegationFactory(document_id=1)
        OfficerAllegationFactory(allegation=allegation)

        data = self.fetch_officer_allegations(has_filters='has:document')

        len(data).should.equal(1)
        data[0]['allegation']['id'].should.equal(allegation.id)

    def test_filter_by_has_map(self):
        data = self.fetch_officer_allegations(has_filters='has:map')
        len(data).should.equal(3)

        allegation = AllegationFactory()
        allegation.point = None
        allegation.save()
        OfficerAllegationFactory(allegation=allegation)

        data = self.fetch_officer_allegations(has_filters='has:map')
        len(data).should.equal(3)
        for i in range(3):
            data[i]['allegation']['id'].shouldnt.equal(allegation.id)

    def test_filter_by_has_address(self):
        data = self.fetch_officer_allegations(has_filters='has:address')
        len(data).should.equal(0)

        allegation1 = AllegationFactory(add1=123)
        OfficerAllegationFactory(allegation=allegation1)
        allegation2 = AllegationFactory(add2='456')
        OfficerAllegationFactory(allegation=allegation2)
        allegation3 = AllegationFactory(add1=789, add2='abc')
        OfficerAllegationFactory(allegation=allegation3)
        result_count = 3

        data = self.fetch_officer_allegations(has_filters='has:address')
        len(data).should.equal(result_count)
        any([
            data[i]['allegation']['id'] == allegation1.id
            for i in range(result_count)]).should.be.true
        any([
            data[i]['allegation']['id'] == allegation2.id
            for i in range(result_count)]).should.be.true
        any([
            data[i]['allegation']['id'] == allegation3.id
            for i in range(result_count)]).should.be.true

    def test_filter_by_has_location(self):
        data = self.fetch_officer_allegations(has_filters='has:location')
        len(data).should.equal(0)

        allegation = AllegationFactory(location='somewhere')
        OfficerAllegationFactory(allegation=allegation)

        data = self.fetch_officer_allegations(has_filters='has:location')
        len(data).should.equal(1)
        data[0]['allegation']['id'].should.equal(allegation.id)

    def test_filter_by_has_investigator(self):
        data = self.fetch_officer_allegations(has_filters='has:investigator')
        allegations_num = len(data)

        allegation = AllegationFactory()
        OfficerAllegationFactory(allegation=allegation)
        OfficerAllegationFactory(
            allegation=AllegationFactory(investigator=None))

        data = self.fetch_officer_allegations(has_filters='has:investigator')
        len(data).should.equal(allegations_num + 1)
        [obj['allegation']['id'] for obj in data].should.contain(allegation.id)

    def test_filter_by_has_identified(self):
        data = self.fetch_officer_allegations(has_filters='has:identified')
        len(data).should.equal(3)

        allegation = AllegationFactory()
        OfficerAllegationFactory(allegation=allegation, officer=None)

        data = self.fetch_officer_allegations(has_filters='has:identified')
        len(data).should.equal(3)
        [obj['allegation']['id'] for obj in data]\
            .shouldnt.contain(allegation.id)
