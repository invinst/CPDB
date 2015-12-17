from django.conf import settings
from django.test import override_settings

from common.tests.core import BaseLivePhoneTestCase, BaseLiveTestCase


class RedirectMobileTestMixin(object):
    @override_settings(
        SITE_INFO={
            'domain': 'cpdb.local',
            'mobile_host': 'm.cpdb.local'
        },
        MIDDLEWARE_CLASSES=(
                'django.middleware.common.CommonMiddleware',
                'common.middleware.subdomain.SubdomainURLRoutingMiddleware',
                'common.middleware.mobile_redirect.MobileRedirectMiddleware',
        )
    )
    def run(self, *args, **kwargs):
        super(RedirectMobileTestMixin, self).run(*args, **kwargs)


class RedirectMobileTest(RedirectMobileTestMixin, BaseLivePhoneTestCase):
    def test_redirect_phone_to_mobile_site(self):
        any_uri = '/any_uri'

        self.visit(any_uri)
        expected_url = '{mobile_subdomain}{uri}'.format(mobile_subdomain=settings.SITE_INFO['mobile_host'], uri=any_uri)

        self.browser.current_url.should.contain(expected_url)


class RedirectMobileDesktopTest(RedirectMobileTestMixin, BaseLiveTestCase):
    def test_does_not_reidrect_on_desktop_site(self):
        any_uri = '/any_uri'

        self.visit(any_uri)
        expected_url = '{mobile_subdomain}{uri}'.format(mobile_subdomain=settings.SITE_INFO['mobile_host'], uri=any_uri)

        self.browser.current_url.shouldnt.contain(expected_url)
