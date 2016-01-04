from allegation.factories import (
    OfficerFactory, AllegationFactory, PoliceWitnessFactory,
    OfficerAllegationFactory)
from common.tests.core import SimpleTestCase
from mobile.services.related_officer_service import RelatedOfficerService
from mobile.utils.sql_helper import SqlHelper


class RelatedOfficerTest(SimpleTestCase):
    def test_co_accused(self):
        officer = OfficerFactory()
        co_accused_officer = OfficerFactory()
        officer_allegation = OfficerAllegationFactory(officer=officer)
        allegation = AllegationFactory(crid=officer_allegation.allegation.crid)
        OfficerAllegationFactory(
            officer=co_accused_officer, allegation=allegation)

        co_accused_officers = RelatedOfficerService.co_accused_officers(
            officer.id)

        SqlHelper.len_of_raw_queryset(co_accused_officers).should.be.equal(1)
        co_accused_officers[0].id.should.be.equal(co_accused_officer.id)
        co_accused_officers[0].num_allegations.should.be.equal(1)

    def test_witness_officer(self):
        officer = OfficerFactory()
        witness_officer = OfficerFactory()
        officer_allegation = OfficerAllegationFactory(officer=officer)
        PoliceWitnessFactory(
            crid=officer_allegation.allegation.crid, officer=witness_officer,
            allegation=officer_allegation.allegation)

        witness_officers = RelatedOfficerService.witness_officers(officer.id)

        SqlHelper.len_of_raw_queryset(witness_officers).should.be.equal(1)
        witness_officers[0].id.should.be.equal(witness_officer.id)
        witness_officers[0].num_allegations.should.be.equal(1)
