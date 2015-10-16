from common.tests.core import BaseLiveTestCase
from allegation.tests.views.ui.test_home_page import IntegrationTestHelperMixin

class RaceGenderTabeTset(BaseLiveTestCase, IntegrationTestHelperMixin):
    def test_race_gender_tab_show_basic_information_about_gender_tab(self):
        self.visit_home()
        self.link('Race & Gender').click()
        self.element_by_tagname_and_text('li', 'Race & Gender').has_class('active')
