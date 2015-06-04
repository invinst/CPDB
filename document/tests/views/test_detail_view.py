from django.core.urlresolvers import reverse
from allegation.factories import AllegationFactory
from common.tests.core import SimpleTestCase


class DetailViewTestCase(SimpleTestCase):
    def setUp(self):
        AllegationFactory()

    def test_valid_request(self):
        response = self.client.get('%s?id=%s' % (reverse('document:view'), 1))

        self.assertEqual(response.status_code, 200)

    def test_missing_id_param(self):
        response = self.client.get(reverse('document:view'))

        self.assertEqual(response.status_code, 400)
