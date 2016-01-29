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

    def visit_investigator_page(self, investigator_id):
        self.visit('/investigator/sluglify/{id}'.format(
            id=investigator_id
            ))

    def expand_first_complaint_row(self):
        self.find('.complaint-row').click()

    def is_complaint_row_expand(self, complaint_row_class_name):
        is_exist = self.element_exist(
            '{class_name} .complaint_detail'.format(
                class_name=complaint_row_class_name))

        is_close = self.element_exist(
            '{class_name} .complaint_detail.closed'.format(
                class_name=complaint_row_class_name))

        return is_exist and not is_close

    def test_browse_investigator_page(self):
        self.visit_home()
        self.until(lambda: self.find('.checkmark.cursor').click())
        self.until(lambda: self.find('.row.cursor').click())
        self.until(lambda: self.element_by_classname_and_text(
            'investigator-name', self.investigator.name))
        # click by javascript to avoid random failed
        self.browser.execute_script('jQuery(".investigator-name").click()')
        self.until(lambda: self.should_see_text(self.investigator.name))
        self.element_exist('.complaint-row').should.be.true
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
            final_outcome_class='not-disciplined'
            )
        self.visit_investigator_page(self.investigator.id)

        # Check two complaint rows exist
        self.element_exist('.complaint-row.not-disciplined').should.be.true
        self.element_exist('.complaint-row.disciplined').should.be.true

        # Expand one row
        self.find('.complaint-row.disciplined').click()

        self.is_complaint_row_expand(
            '.complaint-row.disciplined').should.be.true

        self.is_complaint_row_expand(
            '.complaint-row.not-disciplined').should.be.false

    def test_collapse_complaint_row_by_close_button(self):
        self.visit_investigator_page(self.investigator.id)

        self.find('.complaint-row').click()

        self.is_complaint_row_expand('.complaint-row').should.be.true

        self.find('.btn.btn-close').click()

        self.is_complaint_row_expand('.complaint-row').should.be.false
