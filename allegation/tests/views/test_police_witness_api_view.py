import json

from allegation.factories import (
    OfficerAllegationFactory, PoliceWitnessFactory, OfficerFactory,
    AllegationFactory)

from common.tests.core import SimpleTestCase


class PoliceWitnessAPIViewTestCase(SimpleTestCase):
    def test_get_police_witness_info(self):
        disciplined_code = '028'
        no_disp_code = '600'

        officer_allegation = OfficerAllegationFactory(
            final_outcome=disciplined_code)
        allegation = officer_allegation.allegation
        witness = OfficerFactory()
        PoliceWitnessFactory(
            crid=allegation.crid,
            allegation=allegation,
            officer=witness)

        OfficerAllegationFactory(
            allegation=allegation, final_outcome=disciplined_code)
        no_disp_officer_allegation = OfficerAllegationFactory(
            allegation=allegation, final_outcome=no_disp_code)
        no_disp_officer = no_disp_officer_allegation.officer

        OfficerAllegationFactory()

        result = self.client.get('/api/police-witness/', {
            'crid': officer_allegation.allegation.crid})
        data = json.loads(result.content.decode())

        len(data['police_witness']).should.equal(1)
        witness_info = data['police_witness'][0]
        witness_info['witness']['officer']['pk'].should.equal(witness.id)
        witness_info['witness_officer']['id'].should.equal(witness.id)
        len(witness_info['officers']).should.equal(3)
        for officer_info in witness_info['officers']:
            officer_info['num_complaints'].should.equal(1)
            if officer_info['officer']['id'] == no_disp_officer.id:
                officer_info['no_action_taken'].should.equal(1)
            else:
                officer_info['no_action_taken'].should.equal(0)

    def test_get_related_officer_in_police_witness_info(self):
        no_disp_code = '600'

        allegation1 = AllegationFactory()
        allegation2 = AllegationFactory()

        officer = OfficerFactory()
        OfficerAllegationFactory(
            allegation=allegation1, officer=officer,
            final_outcome=no_disp_code)
        OfficerAllegationFactory(
            allegation=allegation2, officer=officer)

        witness = OfficerFactory()
        PoliceWitnessFactory(
            crid=allegation1.crid,
            allegation=allegation1,
            officer=witness)
        OfficerAllegationFactory(
            allegation=allegation2, officer=witness,
            final_outcome=no_disp_code)

        result = self.client.get('/api/police-witness/', {
            'crid': allegation1.crid})
        data = json.loads(result.content.decode())

        officers = data['police_witness'][0]['officers']
        len(officers).should.equal(1)
        officers[0]['num_complaints'].should.equal(2)
        officers[0]['no_action_taken'].should.equal(2)
