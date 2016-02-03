from common.tests.core import BaseLiveTestCase
from search.factories import SuggestionLogFactory


class SuggestionAdminTestCase(BaseLiveTestCase):
    def test_suggestion_admin(self):
        self.login_user()
        log = SuggestionLogFactory()
        self.visit("/admin/models/")

        self.link("Suggestion logs").click()
        self.should_see_text(log.search_query)
