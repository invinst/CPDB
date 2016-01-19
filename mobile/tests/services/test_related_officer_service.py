from allegation.factories import OfficerFactory, OfficerAllegationFactory
from common.tests.core import SimpleTestCase
from mobile.services.related_officer_service import RelatedOfficerService
from mobile.utils.sql_helper import SqlHelper


class RelatedOfficerTest(SimpleTestCase):
    def test_co_accused(self):
        officer = OfficerFactory()
        co_accused_officer = OfficerFactory()
        officer_allegation = OfficerAllegationFactory(officer=officer)
        OfficerAllegationFactory(
            officer=co_accused_officer,
            allegation=officer_allegation.allegation)

        co_accused_officers = RelatedOfficerService.co_accused_officers(
            officer.id)

        SqlHelper.len_of_raw_queryset(co_accused_officers).should.be.equal(1)
        co_accused_officers[0].id.should.be.equal(co_accused_officer.id)
        co_accused_officers[0].num_allegations.should.be.equal(1)
