import json

from django.core.urlresolvers import reverse

from allegation.factories import OfficerFactory, AllegationFactory
from common.tests.core import SimpleTestCase


class TimelineViewTestCase(SimpleTestCase):
    def setUp(self):
        self.officer = OfficerFactory()
        AllegationFactory.create_batch(2, officer=self.officer)

    def test_timeline_view(self):
        response = self.client.get(reverse('officer:timeline'), {
            'officer': self.officer.id
        })

        response = json.loads(response.content.decode())

        response.should.contain('items')
        isinstance(response['items'], list).should.be.true
        response['items'].should.have.length_of(3)  # officer appt_date

    def test_timeline_use_allegation_start_date_when_incident_date_non(self):
        allegation = AllegationFactory(officer=self.officer, incident_date_only=None)
        self.visit(reverse('officer:timeline'), {
            'officer': self.officer.id
        })
        data = self.json(self.response)
        data['items'].should.have.length_of(4)
        data['items'].should.contain(allegation.start_date.strftime("%Y-%m-%d"))