from django.core.urlresolvers import reverse
from django.test import override_settings
from rest_framework.status import HTTP_301_MOVED_PERMANENTLY, HTTP_404_NOT_FOUND

from allegation.factories import AllegationFactory
from common.tests.core import SimpleTestCase


@override_settings(DEBUG=True)
class AllegationViewTest(SimpleTestCase):
    def test_bad_complaint_page_crid(self):
        response = self.client.get(reverse('allegation:complaint-page', kwargs={'crid': '123456'}), follow=True)
        response.status_code.should.be.equal(HTTP_404_NOT_FOUND)

    def test_should_redirect_to_data_tool_page(self):
        allegation = AllegationFactory()
        response = self.client.get(reverse('allegation:complaint-page', kwargs={'crid': allegation.crid}))
        response.status_code.should.be.equal(HTTP_301_MOVED_PERMANENTLY)
        response.url.should.contain('/data')
