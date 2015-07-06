import json

from django.core.urlresolvers import reverse
from django.test.testcases import SimpleTestCase

from allegation.factories import OfficerFactory, AllegationFactory


class TimelineViewTestCase(SimpleTestCase):
    def test_count_by_num_complaints(self):
        officer = OfficerFactory()
        for _ in range(5):
            AllegationFactory(officer=officer)

        response = self.client.get(reverse('officer:timeline'), {
            'officer': officer.id
        })

        response = json.loads(response.content.decode())

        response.should.contain('items')
        isinstance(response['items'], list).should.be.true