from allegation.factories import (
    OfficerAllegationFactory, InvestigatorFactory, AllegationFactory)
from common.tests.core import BaseLiveTestCase


class InvestigatorViewTestCase(BaseLiveTestCase):
    def setUp(self):
        self.investigator = InvestigatorFactory()
        allegation = AllegationFactory(investigator=self.investigator)
        self.officer_allegation = \
            OfficerAllegationFactory(
                allegation=allegation,
                final_outcome_class='disciplined'
                )

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

    def test_highlight_disciplined_row(self):
        self.visit('/investigator/sluglify/{id}'.format(
            id=self.investigator.id
            ))
        # Check discipline complaint row was highlighted
        self.element_exist('.complaint-row.disciplined').should.be.true

    def test_expand_complaint_row(self):
        OfficerAllegationFactory(
            allegation=self.officer_allegation.allegation,
            final_outcome_class='other'
            )
        self.visit('/investigator/sluglify/{id}'.format(
            id=self.investigator.id
            ))

        # Check two complaint rows exist
        self.element_exist('.complaint-row.other')
        self.element_exist('.complaint-row.disciplined')

        # Expand one row
        self.find('.complaint-row.disciplined').click()

        # Make sure it expand above target
        self.element_exist(
            '.complaint-row.disciplined .complaint_detail.closed'
            ).should.be.false
        # And don't expand another
        self.element_exist(
            '.complaint-row.other .complaint_detail'
            ).should.be.false
