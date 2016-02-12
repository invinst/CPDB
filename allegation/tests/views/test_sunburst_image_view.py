import imghdr

from django.core.urlresolvers import reverse

from rest_framework import status

from common.tests.core import BaseLiveTestCase
from share.factories import SessionFactory


class SunburstImageViewTestCase(BaseLiveTestCase):

    def test_get_image(self):
        session_hash = SessionFactory().hash_id
        response = self.client.get(
            reverse('allegation:sunburst-image', args=[session_hash]), SERVER_NAME='localhost', SERVER_PORT='8081')
        response.status_code.should.equal(status.HTTP_200_OK)
        imghdr.what('', h=response.content).should.equal('png')
