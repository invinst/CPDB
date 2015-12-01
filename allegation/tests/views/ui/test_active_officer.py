from allegation.factories import AllegationFactory
from common.tests.core import BaseLiveTestCase
from share.models import Session


class ActiveOfficerTestCase(BaseLiveTestCase):
    def test_change_filter_clear_active_officers(self):
        allegation = AllegationFactory()
        self.visit_home()
        self.find('.officer .checkmark').click()

        self.link("Categories").click()
        self.until(lambda: self.link(allegation.cat.category).click())
        self.until_ajax_complete()

        session = Session.objects.all().first()
        session.query['active_officers'].should.be.empty
