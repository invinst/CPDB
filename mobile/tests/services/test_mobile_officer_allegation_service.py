from allegation.factories import (
    AllegationFactory, OfficerFactory, OfficerAllegationFactory)
from common.tests.core import SimpleTestCase
from mobile.services.officer_allegation_service import OfficerAllegationService


class MobileOfficerAllegationServiceTest(SimpleTestCase):

    def call_get_officer_allegations(self, officer_id):
        return OfficerAllegationService.get_officer_allegations(
            officer_id=officer_id)

    def test_get_officer_allegations_with_good_information(self):
        crid = 'crid1'
        other_crid = 'crid2'
        officer = OfficerFactory()
        other_officer = OfficerFactory()

        allegation = AllegationFactory(crid=crid)
        OfficerAllegationFactory.create_batch(
            2, allegation=allegation, officer=officer)

        allegation = AllegationFactory(crid=other_crid)
        OfficerAllegationFactory.create_batch(
            1, allegation=allegation, officer=other_officer)

        result = self.call_get_officer_allegations(officer_id=officer.id)

        len(result).should.equal(1)
        len(result[0]['allegation_counts']).should.equal(2)
        result[0]['data'].allegation.crid.should.equal(str(crid))

    def test_get_officer_allegations_with_bad_officer_id(self):
        bad_officer_pk = -1
        result = self.call_get_officer_allegations(officer_id=bad_officer_pk)

        len(result).should.equal(0)
