import json

from django.core.urlresolvers import reverse

from allegation.factories import (
    OfficerFactory, OfficerAllegationFactory, AllegationFactory)
from common.tests.core import SimpleTestCase


class TimelineViewTestCase(SimpleTestCase):
    def setUp(self):
        self.officer = OfficerFactory()
        OfficerAllegationFactory.create_batch(2, officer=self.officer)

    def test_timeline_view(self):
        response = self.client.get(reverse('officer:timeline'), {
            'officer': self.officer.id
        })

        response = json.loads(response.content.decode())

        response.should.contain('items')
        isinstance(response['items'], list).should.be.true
        response['items'].should.have.length_of(3)  # officer appt_date

    def test_timeline_use_allegation_start_date_when_incident_date_non(self):
        allegation = AllegationFactory(incident_date_only=None)
        officer_allegation = OfficerAllegationFactory(
            officer=self.officer, allegation=allegation)
        self.visit(reverse('officer:timeline'), {
            'officer': self.officer.id
        })
        data = self.json(self.response)
        data['items'].should.have.length_of(4)
        data['items'].should.contain(
            officer_allegation.start_date.strftime("%Y-%m-%d"))
