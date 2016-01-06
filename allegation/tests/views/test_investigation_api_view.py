from allegation.factories import (
    AllegationFactory, ComplainingWitnessFactory, PoliceWitnessFactory)
from common.tests.core import SimpleTestCase


class InvestigationAPIViewTestCase(SimpleTestCase):
    def test_get_investigation(self):
        allegation = AllegationFactory()
        ComplainingWitnessFactory(crid=allegation.crid)
        PoliceWitnessFactory(crid=allegation.crid)

        response = self.client.get('/api/investigation/', {
            'crid': allegation.crid
        })
        data = self.json(response)
        # What does this actually test?
