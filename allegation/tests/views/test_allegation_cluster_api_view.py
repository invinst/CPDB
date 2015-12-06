from django.core.urlresolvers import reverse

from allegation.factories import AllegationFactory, OfficerFactory, ComplainingWitnessFactory, PoliceWitnessFactory
from common.tests.core import SimpleTestCase
from common.models import Allegation


RACE_GENDER_API_ENDPOINT = reverse('allegation:allegation-race-gender-api')


class AllegationClusterAPIViewTestCase(SimpleTestCase):
    def test_get_cluster_filtered_by_area(self):
        allegation = AllegationFactory()

        response = self.client.get('/api/allegations/cluster/', {
            'areas__id': allegation.areas.all()[0].id
        })
        data = self.json(response)

        data.should.contain('features')
