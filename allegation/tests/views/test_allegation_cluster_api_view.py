from allegation.factories import AllegationFactory, ComplainingWitnessFactory, PoliceWitnessFactory
from common.tests.core import SimpleTestCase


class AllegationClusterAPIViewTestCase(SimpleTestCase):
    def test_get_cluster_filtered_by_area(self):
        allegation = AllegationFactory()

        response = self.client.get('/api/allegations/cluster/', {
            'areas__id': allegation.areas.all()[0].id
        })
        data = self.json(response)

        data.should.contain('features')
