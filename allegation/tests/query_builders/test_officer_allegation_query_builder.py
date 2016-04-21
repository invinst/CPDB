import datetime

from django.contrib.gis.geos.point import Point
from django.http.request import QueryDict
from django.db.models.query_utils import Q

from allegation.factories import (
    OfficerAllegationFactory, AllegationFactory, OfficerFactory,
    ComplainingWitnessFactory, AllegationCategoryFactory)
from allegation.query_builders import (
    OfficerAllegationQueryBuilder, DISCIPLINE_CODES, NO_DISCIPLINE_CODES, _apply_all_query_methods)
from common.models import OfficerAllegation, Allegation, OUTCOMES
from common.tests.core import SimpleTestCase
from common.utils.haystack import rebuild_index

from allegation.factories import InvestigatorFactory
from document.factories import DocumentFactory


class OfficerAllegationQueryBuilderTestCase(SimpleTestCase):
    def setUp(self):
        self.clean_db()

    def clean_db(self):
        Allegation.objects.all().delete()
        OfficerAllegation.objects.all().delete()

    def test_adhoc_queries(self):
        expected_allegations = [
            OfficerAllegationFactory(
                allegation=AllegationFactory(crid='1'), final_outcome='ZZ')]
        OfficerAllegationFactory(allegation=AllegationFactory(crid='1'))

        query_string = 'final_outcome=ZZ&allegation__crid=1'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_officer_names(self):
        expected_allegations = [
            OfficerAllegationFactory(officer=OfficerFactory(
                officer_first='First', officer_last='Last')),
            OfficerAllegationFactory(officer=OfficerFactory(
                officer_first='Alpha', officer_last='Omega'))]
        OfficerAllegationFactory(officer=OfficerFactory(
            officer_first='Name1', officer_last='Name2'))

        query_string = 'officer_name=First&officer_name=Omega'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_officer_allegation_count(self):
        expected_allegations = [
            OfficerAllegationFactory(
                officer=OfficerFactory(allegations_count=11))]
        OfficerAllegationFactory(officer=OfficerFactory(allegations_count=10))
        OfficerAllegationFactory(officer=OfficerFactory(allegations_count=9))

        query_string = 'officer__allegations_count__gt=10'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_officer_discipline_count(self):
        expected_allegations = [
            OfficerAllegationFactory(
                officer=OfficerFactory(discipline_count=11))]
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
        expected_ids = [o.id for o in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_has_document(self):
        document = DocumentFactory(documentcloud_id=1)

        expected_allegations = [OfficerAllegationFactory(allegation=document.allegation)]
        OfficerAllegationFactory()

        query_string = 'has_document=true'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_has_map(self):
        expected_allegations = [
            OfficerAllegationFactory()]
        allegation = OfficerAllegationFactory().allegation
        allegation.point = None
        allegation.save()

        query_string = 'has_map=true'
        expected_ids = [o.id for o in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_has_address(self):
        expected_allegations = [
            OfficerAllegationFactory(allegation=AllegationFactory(add1=100)),
            OfficerAllegationFactory(allegation=AllegationFactory(add2='100'))]
        OfficerAllegationFactory()

        query_string = 'has_address=true'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_has_location(self):
        expected_allegations = [
            OfficerAllegationFactory(
                allegation=AllegationFactory(location='4 Privet Drive'))]
        OfficerAllegationFactory()

        query_string = 'has_location=true'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_has_investigator(self):
        expected_allegations = [
            OfficerAllegationFactory()]
        OfficerAllegationFactory(
            allegation=AllegationFactory(investigator=None))

        query_string = 'has_investigator=true'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_has_identified(self):
        expected_allegations = [
            OfficerAllegationFactory()]
        OfficerAllegationFactory(
            officer=None)

        query_string = 'has_identified=true'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_has_summary(self):
        expected_allegations = [
            OfficerAllegationFactory(
                allegation=AllegationFactory(summary='Some summary'))]
        OfficerAllegationFactory()

        query_string = 'has_summary=true'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_unsustained_final_finding(self):
        expected_allegations = [
            OfficerAllegationFactory(final_finding=code)
            for code in ['DS', 'EX', 'NA', 'NC', 'NS', 'UN', 'ZZ']]
        OfficerAllegationFactory(final_finding='SU')

        query_string = 'final_finding_text=unsustained'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_outcome_any_discipline(self):
        expected_allegations = [
            OfficerAllegationFactory(final_finding='SU', final_outcome=code)
            for code in DISCIPLINE_CODES]
        OfficerAllegationFactory(final_finding='SU', final_outcome=None)
        OfficerAllegationFactory(final_finding='SU', final_outcome='ZZ')

        query_string = 'outcome_text=any discipline'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_outcome_no_discipline(self):
        expected_allegations = [
            OfficerAllegationFactory(final_finding='SU', final_outcome=code)
            for code in NO_DISCIPLINE_CODES + (None,)]
        OfficerAllegationFactory(final_finding='SU', final_outcome='ZZ')

        query_string = 'outcome_text=no discipline'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_outcome_1_9_days(self):
        keys_1_9_days = ['%d Day Suspension' % ind for ind in range(1, 10)]
        outcomes = [
            pair[0] for pair in OUTCOMES if pair[1] in keys_1_9_days]
        expected_allegations = [
            OfficerAllegationFactory(final_outcome=code)
            for code in outcomes]
        OfficerAllegationFactory(final_outcome='ZZ')

        query_string = 'outcome_text=1-9 days'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_outcome_10_30_days(self):
        keys_10_30_days = ['%d Day Suspension' % ind for ind in range(10, 31)]
        outcomes = [
            pair[0] for pair in OUTCOMES if pair[1] in keys_10_30_days]
        expected_allegations = [
            OfficerAllegationFactory(final_outcome=code)
            for code in outcomes]
        OfficerAllegationFactory(final_outcome='ZZ')

        query_string = 'outcome_text=10-30 days'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_outcome_30_more_days(self):
        expected_allegations = [
            OfficerAllegationFactory(final_outcome=code)
            for code in ["045", "060", "090", "180", "200"]]
        OfficerAllegationFactory(final_outcome='ZZ')

        query_string = 'outcome_text=30 more days'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_complaint_gender(self):
        allegation = AllegationFactory()
        ComplainingWitnessFactory(
            crid=allegation.crid, allegation=allegation, gender='M')
        expected_allegations = [
            OfficerAllegationFactory(allegation=allegation)]

        allegation_2 = AllegationFactory()
        ComplainingWitnessFactory(
            crid=allegation_2.crid, allegation=allegation_2, gender='F')
        OfficerAllegationFactory(allegation=allegation_2)

        OfficerAllegationFactory()

        query_string = 'complainant_gender=M'
        expected_ids = [x.id for x in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_complaint_race(self):
        allegation = AllegationFactory()
        ComplainingWitnessFactory(
            crid=allegation.crid, allegation=allegation, race='Black')
        allegation_2 = AllegationFactory()
        ComplainingWitnessFactory(
            crid=allegation_2.crid, allegation=allegation_2, race='Asian')
        expected_allegations = [
            OfficerAllegationFactory(allegation=allegation),
            OfficerAllegationFactory(allegation=allegation_2)]

        allegation_3 = AllegationFactory()
        ComplainingWitnessFactory(
            crid=allegation_3.crid, allegation=allegation_3, race='White')
        OfficerAllegationFactory(allegation=allegation_3)

        OfficerAllegationFactory()

        query_string = 'complainant_race=Black&complainant_race=Asian'
        expected_ids = [x.id for x in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_complainant_age_filter(self):
        allegation_1 = AllegationFactory()
        allegation_2 = AllegationFactory()
        ComplainingWitnessFactory(age=36, allegation=allegation_1)
        ComplainingWitnessFactory(age=23, allegation=allegation_2)
        oa_1 = OfficerAllegationFactory(allegation=allegation_1)
        oa_2 = OfficerAllegationFactory(allegation=allegation_2)

        self.check_built_query('complainant_age=30-40', [oa_1.id])
        self.check_built_query('complainant_age=<30', [oa_2.id])
        self.check_built_query('complainant_age=>35', [oa_1.id])

    def test_officer_age_filter(self):
        incident_date = datetime.datetime(2000, 1, 1)
        allegation = AllegationFactory(incident_date=incident_date)
        officers = [
            OfficerFactory(birth_year=incident_date.year - 34),
            OfficerFactory(birth_year=incident_date.year - 56)]
        oas = [OfficerAllegationFactory(allegation=allegation, officer=officer) for officer in officers]

        self.check_built_query('officer_age=30-40', [oas[0].id])
        self.check_built_query('officer_age=<40', [oas[0].id])
        self.check_built_query('officer_age=>35', [oas[1].id])

    def test_incident_date_only(self):
        self._test_incident_date_only_range()
        self.clean_db()
        self._test_incident_date_only_year()
        self.clean_db()
        self._test_incident_date_only_year_month()
        self.clean_db()
        self._test_incident_date_only()

    def test_incident_date_time_of_day(self):
        self.clean_db()
        oa1 = OfficerAllegationFactory(allegation=AllegationFactory(
            incident_date=datetime.datetime(2007, 12, 16, 7, 30, 30)
        ))
        OfficerAllegationFactory(allegation=AllegationFactory(
            incident_date=datetime.datetime(2007, 12, 16, 16, 30, 30)
        ))

        self.check_built_query('incident_date_time_of_day=morning', [oa1.id])

    def _test_incident_date_only_range(self):
        expected_allegations = [
            OfficerAllegationFactory(allegation=AllegationFactory(
                incident_date_only=datetime.datetime.strptime(
                    '2016-01-01', '%Y-%m-%d'))),
            OfficerAllegationFactory(allegation=AllegationFactory(
                incident_date_only=datetime.datetime.strptime(
                    '2016-01-02', '%Y-%m-%d')))]
        OfficerAllegationFactory(allegation=AllegationFactory(
            incident_date_only=datetime.datetime.strptime(
                '2016-01-03', '%Y-%m-%d')))

        query_string = 'incident_date_only__range=2016-01-01,2016-01-02'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def _test_incident_date_only_year(self):
        expected_allegations = [
            OfficerAllegationFactory(allegation=AllegationFactory(
                incident_date_only=datetime.datetime.strptime(
                    '2016-01-01', '%Y-%m-%d'))),
            OfficerAllegationFactory(allegation=AllegationFactory(
                incident_date_only=datetime.datetime.strptime(
                    '2016-01-02', '%Y-%m-%d')))]
        OfficerAllegationFactory(allegation=AllegationFactory(
            incident_date_only=datetime.datetime.strptime(
                '2015-01-01', '%Y-%m-%d')))

        query_string = 'incident_date_only__year=2016'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def _test_incident_date_only_year_month(self):
        expected_allegations = [
            OfficerAllegationFactory(allegation=AllegationFactory(
                incident_date_only=datetime.datetime.strptime(
                    '2016-01-01', '%Y-%m-%d'))),
            OfficerAllegationFactory(allegation=AllegationFactory(
                incident_date_only=datetime.datetime.strptime(
                    '2016-01-02', '%Y-%m-%d')))]
        OfficerAllegationFactory(allegation=AllegationFactory(
            incident_date_only=datetime.datetime.strptime(
                '2016-02-01', '%Y-%m-%d')))

        query_string = 'incident_date_only__year_month=2016-01'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def _test_incident_date_only(self):
        expected_allegations = [
            OfficerAllegationFactory(allegation=AllegationFactory(
                incident_date_only=datetime.datetime.strptime(
                    '2016-01-01', '%Y-%m-%d'))),
            OfficerAllegationFactory(allegation=AllegationFactory(
                incident_date_only=datetime.datetime.strptime(
                    '2016-01-03', '%Y-%m-%d')))]
        OfficerAllegationFactory(allegation=AllegationFactory(
            incident_date_only=datetime.datetime.strptime(
                '2016-01-02', '%Y-%m-%d')))

        query_string = \
            'incident_date_only=2016-01-01&incident_date_only=2016-01-03'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_add_data_source_filter(self):
        self._test_foia()
        self.clean_db()
        self._test_pre_foia()

    def _test_foia(self):
        expected_allegations = [
            OfficerAllegationFactory(allegation=AllegationFactory(
                incident_date=datetime.datetime.strptime('2011-01-01', '%Y-%m-%d')))]
        OfficerAllegationFactory(
            allegation=AllegationFactory(
                incident_date=datetime.datetime.strptime('2010-12-31', '%Y-%m-%d')),
            start_date=datetime.datetime.strptime('2010-12-31', '%Y-%m-%d')
        )

        query_string = 'data_source=FOIA'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def _test_pre_foia(self):
        expected_allegations = [
            OfficerAllegationFactory(allegation=AllegationFactory(
                incident_date=datetime.datetime.strptime(
                    '2010-12-31', '%Y-%m-%d')))]
        OfficerAllegationFactory(allegation=AllegationFactory(
            incident_date=datetime.datetime.strptime(
                '2011-01-01', '%Y-%m-%d')))

        query_string = 'data_source=pre-FOIA'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_allegation_summary(self):
        expected_allegations = [
            OfficerAllegationFactory(allegation=AllegationFactory(
                summary='some some really long summary')),
            OfficerAllegationFactory(allegation=AllegationFactory(
                summary='I am so sorry'))]
        OfficerAllegationFactory()

        rebuild_index()

        query_string = 'allegation_summary=so'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_allegation_summary_multiple_word_term(self):
        expected_allegations = [
            OfficerAllegationFactory(allegation=AllegationFactory(
                summary='some some really long summary'))]
        OfficerAllegationFactory(
            allegation=AllegationFactory(summary='I am so sorry some'))

        rebuild_index()

        query_string = 'allegation_summary=some some'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_investigator_agency(self):
        self._test_investigator_agency_ipra()
        self.clean_db()
        self._test_investigator_agency_iad()

    def _test_investigator_agency_ipra(self):
        expected_allegations = [
            OfficerAllegationFactory(allegation=AllegationFactory(
                investigator=InvestigatorFactory(agency='IPRA')))]
        OfficerAllegationFactory(allegation=AllegationFactory(
            investigator=InvestigatorFactory(agency='IAD')))

        query_string = 'allegation__investigator__agency=IPRA'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def _test_investigator_agency_iad(self):
        expected_allegations = [
            OfficerAllegationFactory(allegation=AllegationFactory(
                investigator=InvestigatorFactory(agency='IAD')))]
        OfficerAllegationFactory(allegation=AllegationFactory(
            investigator=InvestigatorFactory(agency='IPRA')))

        query_string = 'allegation__investigator__agency=IAD'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_allegation_category_on_duty(self):
        expected_allegations = [
            OfficerAllegationFactory(cat=AllegationCategoryFactory(
                on_duty=True))]
        OfficerAllegationFactory()

        query_string = 'cat__on_duty=true'
        expected_ids = [allegation.id for allegation in expected_allegations]

        self.check_built_query(query_string, expected_ids)

    def test_apply_all_query_methods(self):
        query_1 = Q(filter1='value1')
        query_2 = Q(filter2='value2')

        class QueryBuilderStub(object):
            _q_method_1_called_with = None
            _q_method_2_called_with = None

            def _q_method_1(self, params):
                self._q_method_1_called_with = params
                return query_1

            def _q_method_2(self, params):
                self._q_method_2_called_with = params
                return query_2

        builder = QueryBuilderStub()
        params = QueryDict()

        repr(_apply_all_query_methods(builder, params)).should.be.equal(repr(query_1 & query_2))
        builder._q_method_1_called_with.should.equal(params)
        builder._q_method_2_called_with.should.equal(params)

    def test_exclude_ignore_params(self):
        params = QueryDict('a=1&b=2&c=3')
        builder = OfficerAllegationQueryBuilder()
        sorted(builder._exclude_ignore_params(params, None).keys()).should.equal(['a', 'b', 'c'])
        sorted(builder._exclude_ignore_params(params, ['c', 'd']).keys()).should.equal(['a', 'b'])

    def test_investigator_agency_not_exists(self):
        params = QueryDict('allegation__investigator__agency=abc')
        builder = OfficerAllegationQueryBuilder()
        queries = builder.build(params)
        repr(queries).should.equal(repr(Q()))

    def test_adhoc_queries_null(self):
        builder = OfficerAllegationQueryBuilder()
        queries = builder.build(QueryDict('id=None'))
        repr(queries).should.equal(repr(Q(id__isnull=True)))
        queries = builder.build(QueryDict('cat=null'))
        repr(queries).should.equal(repr(Q(cat__isnull=True)))

    def check_built_query(self, query_string, expected_ids):
        params = QueryDict(query_string)

        builder = OfficerAllegationQueryBuilder()
        query = builder.build(params)
        results = OfficerAllegation.objects\
            .filter(query).values_list('id', flat=True)

        set(list(results)).should.equal(set(expected_ids))
