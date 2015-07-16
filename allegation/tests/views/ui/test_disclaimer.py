from common.tests.core import *


class HomePageDisclaimerTestCase(BaseLiveTestCase):
    def test_disclaimer_modal_in_the_time_user_visit_homepage(self):
        self.browser.delete_all_cookies()
        self.visit('/')
        self.should_see_text('Disclaimer')

        # then revisit that page
        self.visit('/')
        self.should_not_see_text('Disclaimer')
