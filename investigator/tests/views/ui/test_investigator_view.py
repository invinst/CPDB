from allegation.factories import (
    OfficerAllegationFactory, InvestigatorFactory, AllegationFactory)
from common.tests.core import BaseLiveTestCase


class InvestigatorViewTestCase(BaseLiveTestCase):
    def setUp(self):
        self.investigator = InvestigatorFactory()
        allegation = AllegationFactory(investigator=self.investigator)
        self.officer_allegation = \
            OfficerAllegationFactory(allegation=allegation)

    def test_browse_investigator_page(self):
        self.visit_home()
        self.until(lambda: self.find('.checkmark.cursor').click())
        self.until(lambda: self.find('.row.cursor').click())
        self.until(lambda: self.element_by_classname_and_text(
            'investigator-name', self.investigator.name))
        # click by javascript to avoid random failed
        self.browser.execute_script('jQuery(".investigator-name").click()')
        self.until(lambda: self.should_see_text(self.investigator.name))
        len(self.find_all('.complaint-row')).should.equal(1)
        self.should_see_text(self.officer_allegation.cat.allegation_name)
