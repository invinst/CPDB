from django.conf import settings

from common.tests.core import BaseLivePhoneTestCase


class RedirectMobileTest(BaseLivePhoneTestCase):
    def test_redirect_phone_to_mobile_site(self):
        any_uri = '/any_uri'

        self.visit(any_uri)
        expected_url = '{mobile_subdomain}{uri}'.format(mobile_subdomain=settings.SITE_INFO['mobile_host'], uri=any_uri)

        self.browser.current_url.should.contain(expected_url)
