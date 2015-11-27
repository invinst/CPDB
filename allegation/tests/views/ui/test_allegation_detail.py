from allegation.factories import AllegationFactory, AreaFactory
from common.tests.core import BaseLiveTestCase


class AllegationDetailTestCase(BaseLiveTestCase):
    # Since we lost this marker many times, so we write this test to ensure it's available
    # In case this test failed, please take a look on its url in allegation/constants/AppConstants.js
    def test_marker_should_be_available(self):
        area = AreaFactory()
        AllegationFactory(add1=None, add2=None, point=area.polygon.centroid)

        self.visit_home()
        self.find('.checkmark').click()
        self.until(lambda: self.element_exist('.complaint_list'))
        self.find('.complaint-row > .row').click()
        self.element_exist('.complaint_detail').should.equal(True)

        image = self.until(lambda: self.find('.location img'))
        alternative_text = image.get_attribute('src')

        len(alternative_text).shouldnt.equal(0)
        self.browser.execute_script("return $('.location img')[0].naturalWidth > 0").should.equal(True)
