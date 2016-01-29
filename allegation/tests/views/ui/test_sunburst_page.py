from django.core.urlresolvers import reverse

from common.tests.core import BaseLiveTestCase
from share.factories import SessionFactory


class SunburstPageTestCase(BaseLiveTestCase):

    def init_session(self):
        self.db_session = SessionFactory()

        session = self.client.session
        session['owned_sessions'] = [self.db_session.id]
        session.save()

        return self.db_session.hash_id

    def test_get_sunburst_page(self):
        session_hash = self.init_session()
        self.visit(reverse('allegation:sunburst', args=[session_hash]))
        self.find('svg g path').should.be.ok
