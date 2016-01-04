from django.http.request import QueryDict
from allegation.factories import OfficerAllegationFactory, AllegationFactory, OfficerFactory
from allegation.query_builders import OfficerAlegationQueryBuilder
from common.models import OfficerAllegation
from common.tests.core import SimpleTestCase


class OfficerAllegationQueryBuilderTestCase(SimpleTestCase):
    def setUp(self):
        self.builder = OfficerAlegationQueryBuilder()

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

    def check_built_query(self, query_string, expected_ids):
        params = QueryDict(query_string)

        query = self.builder.build(params)
        results = OfficerAllegation.objects.filter(query).values_list('id', flat=True)

        list(results).should.equal(expected_ids)

