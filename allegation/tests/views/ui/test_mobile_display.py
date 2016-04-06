from common.tests.core import BaseMobileLiveTestCase


class MobileDisplayTestCase(BaseMobileLiveTestCase):
    def test_data_tool_page_display(self):
        self.visit_home()
        self.find('.nav-tabs .map').text.should.contain('Map')

        self.link('Outcomes').click()
        self.find('.nav-tabs .map').get_attribute('class').shouldnt.contain('active')
