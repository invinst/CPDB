from django.core.urlresolvers import reverse

from common.tests.core import BaseLiveTestCase
from share.factories import SessionFactory


class SunburstPageTestCase(BaseLiveTestCase):

    def test_get_sunburst_page(self):
        session_hash = SessionFactory().hash_id
        self.visit(reverse('allegation:sunburst', args=[session_hash]))
        self.find('svg g path').should.be.ok
