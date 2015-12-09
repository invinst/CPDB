from django.core.urlresolvers import reverse

from allegation.factories import AllegationFactory, OfficerFactory, ComplainingWitnessFactory, PoliceWitnessFactory
from common.tests.core import SimpleTestCase
from common.models import Allegation


class InvestigationAPIViewTestCase(SimpleTestCase):
    def test_get_investigation(self):
        allegation = AllegationFactory()
        complaint_witness = ComplainingWitnessFactory(crid=allegation.crid)
        police_witness = PoliceWitnessFactory(crid=allegation.crid)

        response = self.client.get('/api/investigation/', {
            'crid': allegation.crid
        })
        data = self.json(response)
