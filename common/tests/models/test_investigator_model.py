from allegation.factories import InvestigatorFactory
from common.tests.core import SimpleTestCase


class InvestigatorModelTestCase(SimpleTestCase):
    def test_absolute_url(self):
        investigator = InvestigatorFactory(name='Daniel Neubeck')
        investigator.absolute_url.should.equal('/investigator/daniel-neubeck/%s' % investigator.id)
