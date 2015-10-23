from common.tests.core import BaseMobileLiveTestCase



class MobileDisplayTestCase(BaseMobileLiveTestCase):
    def test_data_tool_page_display(self):
        self.visit('/')
        self.button('View Database').click()
        self.until(lambda: self.should_see_text('Map'))

        self.link('Outcomes').click()
        self.until(lambda: self.find('.tab-pane#map').get_attribute('class').shouldnt.contain('active'))
