from django.contrib.gis.geos.point import Point
from django.http.request import QueryDict
from allegation.factories import OfficerAllegationFactory, AllegationFactory, OfficerFactory
from allegation.query_builders import OfficerAllegationQueryBuilder
from common.models import OfficerAllegation
from common.tests.core import SimpleTestCase


class OfficerAllegationQueryBuilderTestCase(SimpleTestCase):
    def setUp(self):
        self.builder = OfficerAllegationQueryBuilder()

    def test_adhoc_queries(self):
        expected_allegations = [
            OfficerAllegationFactory(allegation=AllegationFactory(crid='1'))]
        OfficerAllegationFactory(allegation=AllegationFactory(crid='1'))

        query_string = 'allegation__id=1&allegation__crid=1'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_officer_names(self):
        expected_allegations = [
            OfficerAllegationFactory(officer=OfficerFactory(officer_first='First', officer_last='Last')),
            OfficerAllegationFactory(officer=OfficerFactory(officer_first='Alpha', officer_last='Omega'))]
        OfficerAllegationFactory(officer=OfficerFactory(officer_first='Name1', officer_last='Name2'))

        query_string = 'officer_name=First&officer_name=Omega'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_officer_allegation_count(self):
        expected_allegations = [
            OfficerAllegationFactory(officer=OfficerFactory(allegations_count=11))]
        OfficerAllegationFactory(officer=OfficerFactory(allegations_count=10))
        OfficerAllegationFactory(officer=OfficerFactory(allegations_count=9))

        query_string = 'officer__allegations_count__gt=10'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_officer_discipline_count(self):
        expected_allegations = [
            OfficerAllegationFactory(officer=OfficerFactory(discipline_count=11))]
        OfficerAllegationFactory(officer=OfficerFactory(discipline_count=10))
        OfficerAllegationFactory(officer=OfficerFactory(discipline_count=9))

        query_string = 'officer__discipline_count__gt=10'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_latlng(self):
        expected_allegations = OfficerAllegationFactory.create_batch(2)
        for i in range(len(expected_allegations)):
            allegation = expected_allegations[i].allegation
            allegation.point = Point(0 + i/1000, 0 + 1/1000)
            allegation.save()
        allegation = OfficerAllegationFactory().allegation
        allegation.point = Point(650, 650)
        allegation.save()

        query_string = 'latlng=0,0&radius=500'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_has_document(self):
        expected_allegations = [
            OfficerAllegationFactory(allegation=AllegationFactory(document_id=1))]
        OfficerAllegationFactory()

        query_string = 'has_filters=has:document'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_has_map(self):
        expected_allegations = [
            OfficerAllegationFactory()]
        allegation = OfficerAllegationFactory().allegation
        allegation.point = None
        allegation.save()

        query_string = 'has_filters=has:map'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_has_address(self):
        expected_allegations = [
            OfficerAllegationFactory(allegation=AllegationFactory(add1=100)),
            OfficerAllegationFactory(allegation=AllegationFactory(add2='100'))]
        OfficerAllegationFactory()

        query_string = 'has_filters=has:address'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_has_location(self):
        expected_allegations = [
            OfficerAllegationFactory(allegation=AllegationFactory(location='4 Privet Drive'))]
        OfficerAllegationFactory()

        query_string = 'has_filters=has:location'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_has_investigator(self):
        expected_allegations = [
            OfficerAllegationFactory()]
        OfficerAllegationFactory(allegation=AllegationFactory(investigator=None))

        query_string = 'has_filters=has:investigator'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_unsustained_final_finding(self):
        expected_allegations = [
            OfficerAllegationFactory(allegation=AllegationFactory(final_finding=code))
                for code in ['DS', 'EX', 'NA', 'NC', 'NS', 'UN']]
        OfficerAllegationFactory()

        query_string = 'final_finding_text=unsustained'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def check_built_query(self, query_string, expected_ids):
        params = QueryDict(query_string)

        query = self.builder.build(params)
        results = OfficerAllegation.objects.filter(query).values_list('id', flat=True)

        list(results).should.equal(expected_ids)

