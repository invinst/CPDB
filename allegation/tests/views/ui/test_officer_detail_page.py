from allegation.factories import AllegationFactory
from common.tests.core import BaseLiveTestCase


class OfficerDetailPageTestCase(BaseLiveTestCase):
    def setUp(self):
        self.allegation = AllegationFactory()

    def test_click_to_officer_card_lead_to_detail_page(self):
        # Because our detail page just use the component from home page, so we only need a quick integration test to
        # ensure that it's working
        self.visit('/')
        self.find('.officer').click()
        self.element_exist('#OfficerDetail')
