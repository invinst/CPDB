import json
from django.core.urlresolvers import reverse
from django.test.testcases import SimpleTestCase
from allegation.factories import OfficerFactory, AllegationFactory


class CountViewTestCase(SimpleTestCase):
    def test_count_by_num_complaints(self):
        self.officers = []
        for _ in range(4):
            self.officers.append(OfficerFactory())
        for i in range(2):
            AllegationFactory(officer=self.officers[i])

        response = self.client.get(reverse('officer:count') + '?by=num_complaints')
        count = json.loads(response.content.decode())

        # Does not count officers with 0 complaint
        self.assertListEqual(count, [2])

    def test_count_no_param(self):
        response = self.client.get(reverse('officer:count'))

        self.assertEqual(response.status_code, 400)

    def test_count_no_param_matched(self):
        response = self.client.get(reverse('officer:count') + '?by=num_hair')

        self.assertEqual(response.status_code, 400)
