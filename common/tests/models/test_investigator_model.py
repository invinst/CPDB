from allegation.factories import InvestigatorFactory
from common.models import Investigator
from common.tests.core import SimpleTestCase


class InvestigatorModelTestCase(SimpleTestCase):
    def setUp(self):
        Investigator.objects.all().delete()

    def test_absolute_url(self):
        investigator = InvestigatorFactory(name='Daniel Neubeck')
        investigator.absolute_url.should.equal('/investigator/daniel-neubeck/1')
