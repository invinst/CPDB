import json
from django.core import management
from django.core.urlresolvers import reverse
from django.test.testcases import SimpleTestCase
from allegation.factories import OfficerFactory, ComplaintFactory


class CountViewTestCase(SimpleTestCase):
    def test_count_by_num_complaints(self):
        self.officers = []
        for _ in range(4):
            self.officers.append(OfficerFactory())
        for i in range(2):
            ComplaintFactory(officers=self.officers[0:i + 1])

        management.call_command('calculate_allegations_count')

        response = self.client.get(reverse('officer:count'))

        count = json.loads(response.content.decode())

        # Does not count officers with 0 complaint
        self.assertListEqual(count, [0, 1, 1])
