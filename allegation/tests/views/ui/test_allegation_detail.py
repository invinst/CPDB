import datetime
from faker import Faker

from allegation.factories import AllegationFactory, OfficerAllegationFactory
from common.tests.core import BaseLiveTestCase
from allegation.tests.utils.allegation_row_helper_mixin import AllegationRowHelperMixin


class AllegationDetailTestCase(AllegationRowHelperMixin, BaseLiveTestCase):
    def test_complaint_detail_with_long_summary(self):
        fake = Faker()
        very_long_sentence = fake.sentence(200)

        allegation = AllegationFactory(summary=very_long_sentence)
        OfficerAllegationFactory(allegation=allegation)

        self.open_complaint_detail()

        self.find('.complaint-row > .row').click()
        self.element_exist('.complaint_detail').should.be.true

        self.click_by_js(self.link('Read more...'))

        self.should_see_text(allegation.summary)
        self.link('Read more...').should.be.false

    def test_complaint_correct_final_status_unknown(self):
        OfficerAllegationFactory(
            final_finding=None,
            final_outcome=None
        )

        self.open_complaint_detail()

        self.until(lambda: self.element_exist('.complaint-list'))
        self.find('.complaint-row > .row').click()
        self.should_see_text('Unknown')

    def test_complaint_correct_final_status_known(self):
        OfficerAllegationFactory(
            final_finding='NC',
            final_outcome='000'
            )
        self.open_complaint_detail()

        self.until(lambda: self.element_exist('.complaint-list'))
        self.find('.complaint-row > .row').click()
        self.should_see_text('No Cooperation')
        self.should_see_text('Violation Noted')

    def test_complaint_detail_summary(self):
        allegation = AllegationFactory()
        officer_allegation = OfficerAllegationFactory(
            allegation=allegation,
            final_finding='UN'
            )

        self.visit_home()
        self.find('.officer.active .checkmark').click()

        self.until_ajax_complete()

        self.find('.complaint-row > .row').click()
        self.element_exist('.complaint_detail').should.be.true

        # Verify content in expanded view are correct
        self.should_see_text('Final Outcome\n{final_outcome}'.format(
            final_outcome=officer_allegation.get_final_outcome_display()
            )
        )
        self.should_see_text('CRID {crid}'.format(crid=allegation.crid))
        self.should_see_text(officer_allegation.cat.category)
        self.should_see_text(officer_allegation.cat.allegation_name)
        self.should_see_text('Final Finding\n{final_finding}'.format(
            final_finding=officer_allegation.get_final_finding_display()
            )
        )

    def test_high_light_disciplined_row(self):
        OfficerAllegationFactory(
            final_outcome_class='disciplined'
            )

        self.visit_home()
        self.find('.officer.active .checkmark').click()

        self.until_ajax_complete()

        self.element_exist('.complaint-row.disciplined').should.be.true

    def test_highlight_not_disciplined_row(self):
        OfficerAllegationFactory(
            final_outcome_class='not-disciplined'
            )

        self.visit_home()
        self.find('.officer.active .checkmark').click()

        self.until_ajax_complete()

        self.element_exist('.complaint-row.disciplined').should.be.false

    def test_start_end_date_on_timeline(self):
        now = datetime.datetime.now()
        OfficerAllegationFactory(
            start_date=now,
            end_date=now + datetime.timedelta(days=30)
        )

        self.visit_home()
        self.find('.officer.active .checkmark').click()

        self.until_ajax_complete()
        self.find('.complaint-row > .row').click()
        self.until(lambda: self.element_exist('.timeline'))
        self.element_exist('.timeline-datestart').should.be.true
        self.element_exist('.timeline-dateend').should.be.true

    def test_start_date_not_on_timeline(self):
        now = datetime.datetime.now()
        OfficerAllegationFactory(
            start_date=None,
            end_date=now + datetime.timedelta(days=30)
        )

        self.visit_home()
        self.find('.officer.active .checkmark').click()

        self.until_ajax_complete()
        self.find('.complaint-row > .row').click()
        self.until(lambda: self.element_exist('.timeline'))
        self.element_exist('.timeline-datestart').should.be.false
        self.element_exist('.timeline-dateend').should.be.true

    def test_end_date_not_on_timeline(self):
        now = datetime.datetime.now()
        OfficerAllegationFactory(
            start_date=now,
            end_date=None
        )

        self.visit_home()
        self.find('.officer.active .checkmark').click()

        self.until_ajax_complete()
        self.find('.complaint-row > .row').click()
        self.until(lambda: self.element_exist('.timeline'))
        self.element_exist('.timeline-dateend').should.be.false
        self.element_exist('.timeline-datestart').should.be.true
