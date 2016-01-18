from allegation.factories import InvestigatorFactory, AllegationFactory, OfficerAllegationFactory
from common.tests.core import BaseLiveTestCase


class BrowseInvestigatorTestCase(BaseLiveTestCase):
    def test_browse_investigator_page(self):
        investigator = InvestigatorFactory()
        allegation = AllegationFactory(investigator=investigator)
        OfficerAllegationFactory(allegation=allegation)

        self.visit('/investigator/slugify/{id}'.format(id=investigator.id))
        self.until(lambda: len(self.find_all('.complaint-row')).should.equal(1))
