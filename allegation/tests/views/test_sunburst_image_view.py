import imghdr

from django.core.urlresolvers import reverse

from rest_framework import status

from common.tests.core import SimpleTestCase
from share.factories import SessionFactory


class SunburstImageViewTestCase(SimpleTestCase):

    def init_session(self):
        self.db_session = SessionFactory()

        session = self.client.session
        session['owned_sessions'] = [self.db_session.id]
        session.save()

        return self.db_session.hash_id

    def test_get_image(self):
        session_hash = self.init_session()
        response = self.client.get(reverse('allegation:sunburst-image', args=[session_hash]))
        response.status_code.should.equal(status.HTTP_200_OK)
        imghdr.what('', h=response.content).should.equal('png')
