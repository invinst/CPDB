import json

from django.core import management
from django.core.urlresolvers import reverse

from allegation.factories import OfficerFactory, OfficerAllegationFactory
from common.tests.core import SimpleTestCase


class CountViewTestCase(SimpleTestCase):
    def test_count_by_num_complaints(self):
        self.officers = []
        for _ in range(4):
            self.officers.append(OfficerFactory())

        for i in range(2):
            OfficerAllegationFactory(officer=self.officers[i])

        management.call_command('calculate_allegations_count')

        response = self.client.get(reverse('officer:count'))

        count = json.loads(response.content.decode())

        # Does not count officers with 0 complaint
        self.assertListEqual(count, [0, 2])

    def test_count_no_complaint(self):
        self.visit(reverse('officer:count'))
        data = self.json(self.response)
        data.should.equal([0])
