from allegation.factories import AllegationFactory, OfficerFactory
from common.tests.core import SimpleTestCase
from mobile.services.allegation_service import AllegationService


class MobileAllegationServiceTest(SimpleTestCase):

    def call_get_officer_allegations(self, officer_id):
        return AllegationService.get_officer_allegations(officer_id=officer_id)

    def test_get_officer_allegations_with_good_information(self):
        crid = 'crid1'
        other_crid = 'crid2'
        officer = OfficerFactory()
        other_officer = OfficerFactory()
        AllegationFactory.create_batch(2, officer=officer, crid=crid)
        AllegationFactory.create_batch(1, officer=other_officer, crid=other_crid)

        result = self.call_get_officer_allegations(officer_id=officer.id)

        len(result).should.equal(1)
        len(result[0]['allegation_counts']).should.equal(2)
        result[0]['data'].crid.should.equal(str(crid))

    def test_get_officer_allegations_with_bad_officer_id(self):
        bad_officer_pk = -1
        result = self.call_get_officer_allegations(officer_id=bad_officer_pk)

        len(result).should.equal(0)
