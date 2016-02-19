from faker import Faker

from allegation.factories import AllegationFactory, AreaFactory,\
    OfficerAllegationFactory
from common.tests.core import BaseLiveTestCase


class AllegationDetailTestCase(BaseLiveTestCase):
    # Since we lost this marker many times, so we write this test to ensure
    # it's available. In case this test failed, please take a look on its url
    # in allegation/constants/AppConstants.js
    def open_complaint_detail(self):
        self.visit_home()
        self.find('.checkmark').click()

    def test_marker_should_be_available(self):
        area = AreaFactory()
        allegation = AllegationFactory(
            add1=None,
            add2=None,
            point=area.polygon.centroid
            )
        OfficerAllegationFactory(allegation=allegation)

        self.open_complaint_detail()

        self.until(lambda: self.element_exist('.complaint-list'))
        self.find('.complaint-row > .row').click()
        self.element_exist('.complaint_detail').should.equal(True)

        image = self.until(lambda: self.find('.complaint-map img'))
        alternative_text = image.get_attribute('src')

        len(alternative_text).shouldnt.equal(0)
        self.browser.execute_script(
            "return $('.complaint-map img')[0].naturalWidth > 0"
            ).should.equal(True)

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
        self.should_see_text('Investigation Finding\n{final_finding}'.format(
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
