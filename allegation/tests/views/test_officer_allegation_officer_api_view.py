import json
from django.core import management

from allegation.tests.views.base import OfficerAllegationApiTestBase
from allegation.factories import (
    OfficerFactory, OfficerAllegationFactory)


class OfficerAllegationOfficerApiTestCase(OfficerAllegationApiTestBase):
    def test_response_format(self):
        response = self.client.get("/api/officer-allegations/officers/")

        response.status_code.should.equal(200)
        data = json.loads(response.content.decode())

        data.should.contain('officers')
        data.should.contain('overview')

        isinstance(data['officers'], list).should.be.true
        isinstance(data['overview'], list).should.be.true

    def test_query_for_repeaters(self):
        normal = OfficerFactory()
        repeater = OfficerFactory()
        OfficerAllegationFactory(officer=normal)
        OfficerAllegationFactory.create_batch(10, officer=repeater)

        management.call_command('calculate_allegations_count')

        response = self.client.get(
            '/api/officer-allegations/officers/?officer__allegations_count__gt=9')
        data = json.loads(response.content.decode())
        any([officer['id'] == repeater.id for officer in data['officers']])\
            .should.be.true

    def test_query_for_discipline_count(self):
        officer_1 = OfficerFactory()
        officer_2 = OfficerFactory()
        OfficerAllegationFactory(officer=officer_1)
        OfficerAllegationFactory.create_batch(
            10, officer=officer_2, final_outcome_class='disciplined')

        management.call_command('calculate_allegations_count')

        response = self.client.get(
            '/api/officer-allegations/officers/?officer__discipline_count__gt=9')
        data = json.loads(response.content.decode())
        returned_officer = data['officers'][0]
        officer_2.id.should.equal(returned_officer['id'])

        len(data['officers']).should.equal(1)

    def test_allegation_officer_filter_allegation_count(self):
        final_finding_filter = 'SU'
        diff_final_finding_filter = 'NS'

        officer = OfficerFactory()
        OfficerAllegationFactory(
            officer=officer, final_finding=final_finding_filter)
        OfficerAllegationFactory(
            officer=officer, final_finding=diff_final_finding_filter)

        response = self.client.get(
            '/api/officer-allegations/officers/?final_finding={final_finding_filter}'
            .format(final_finding_filter=final_finding_filter))
        data = json.loads(response.content.decode())
        len(data['officers']).should.equal(1)
        data['officers'][0]['filtered_allegations_count'].should.equal(1)
