from faker import Faker

from allegation.factories import AllegationFactory, AreaFactory
from common.tests.core import BaseLiveTestCase


class AllegationDetailTestCase(BaseLiveTestCase):
    # Since we lost this marker many times, so we write this test to ensure it's available
    # In case this test failed, please take a look on its url in allegation/constants/AppConstants.js
    def open_complaint_detail(self):
        self.visit_home()
        self.find('.checkmark').click()

    def test_marker_should_be_available(self):
        area = AreaFactory()
        AllegationFactory(add1=None, add2=None, point=area.polygon.centroid)

        self.open_complaint_detail()

        self.until(lambda: self.element_exist('.complaint_list'))
        self.find('.complaint-row > .row').click()
        self.element_exist('.complaint_detail').should.equal(True)

        image = self.until(lambda: self.find('.complaint-map img'))
        alternative_text = image.get_attribute('src')

        len(alternative_text).shouldnt.equal(0)
        self.browser.execute_script("return $('.complaint-map img')[0].naturalWidth > 0").should.equal(True)

    def test_complaint_detail_with_long_summary(self):
        fake = Faker()
        very_long_sentence = fake.sentence(200)

        allegation = AllegationFactory(summary=very_long_sentence)

        self.open_complaint_detail()

        self.until(lambda: self.element_exist('.complaint_list'))
        self.find('.complaint-row > .row').click()
        self.element_exist('.complaint_detail').should.equal(True)

        self.link('Read more...').click()
        self.should_see_text(allegation.summary)
        self.link('Read more...').should.be.false
