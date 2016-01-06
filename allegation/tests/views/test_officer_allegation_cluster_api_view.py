from allegation.factories import OfficerAllegationFactory
from common.tests.core import SimpleTestCase


class OfficerAllegationClusterAPIViewTestCase(SimpleTestCase):
    def test_get_cluster_filtered_by_area(self):
        officer_allegation = OfficerAllegationFactory()

        response = self.client.get('/api/officer-allegations/cluster/', {
            'areas__id': officer_allegation.allegation.areas.all()[0].id
        })
        data = self.json(response)

        data.should.contain('features')
