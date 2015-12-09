import json
from django.core import management

from allegation.tests.views.base import AllegationApiTestBase
from allegation.factories import AllegationFactory, OfficerFactory
from common.models import *

class AllegationOfficerApiTestCase(AllegationApiTestBase):
    def test_response_format(self):
        response = self.client.get("/api/allegations/officers/")

        response.status_code.should.equal(200)
        data = json.loads(response.content.decode())

        data.should.contain('officers')
        data.should.contain('overview')

        isinstance(data['officers'], list).should.be.true
        isinstance(data['overview'], list).should.be.true

    def test_query_for_repeaters(self):
        normal = OfficerFactory()
        repeater = OfficerFactory()
        AllegationFactory(officer=normal)
        AllegationFactory.create_batch(10, officer=repeater)

        management.call_command('calculate_allegations_count')

        response = self.client.get("/api/allegations/officers/?officer__allegations_count__gt=9")
        data = json.loads(response.content.decode())
        any([officer['id'] == repeater.id for officer in data['officers']]).should.be.true

    def test_query_for_discipline_count(self):
        officer_1 = OfficerFactory()
        officer_2 = OfficerFactory()
        AllegationFactory(officer=officer_1)
        AllegationFactory.create_batch(10, officer=officer_2, final_outcome_class='disciplined')

        management.call_command('calculate_allegations_count')

        response = self.client.get("/api/allegations/officers/?officer__discipline_count__gt=9")
        data = json.loads(response.content.decode())
        returned_officer = data['officers'][0]
        officer_2.id.should.equal(returned_officer['id'])

        len(data['officers']).should.equal(1)

    def test_allegation_officer_filter_allegation_count(self):
        final_finding_filter = 'SU'
        num_of_officers = 3
        num_of_allegations_per_officer = 5

        officers = OfficerFactory.create_batch(num_of_officers)
        expect_filtered_allegations_count = []

        for officer in officers:
            officer_allegations = AllegationFactory.create_batch(num_of_allegations_per_officer, officer=officer)
            officer_filtered_allegations_count = len([
                allegation for allegation in officer_allegations
                if allegation.final_finding == final_finding_filter
            ])
            if officer_filtered_allegations_count != 0:
                expect_filtered_allegations_count.append({
                    'officer_id': officer.id,
                    'filtered_allegations_count': officer_filtered_allegations_count
                })

        expect_filtered_allegations_count.sort(key=lambda allegation_count:-allegation_count['officer_id'])

        management.call_command('calculate_allegations_count')

        response = self.client.get("/api/allegations/officers/?final_finding={final_finding_filter}".format(final_finding_filter=final_finding_filter))
        data = json.loads(response.content.decode())
        filtered_allegations_count = data['allegations_count']
        filtered_allegations_count.should.equal(expect_filtered_allegations_count)
