from django.conf import settings
from selenium.webdriver.firefox import webdriver
from selenium.webdriver.firefox.webdriver import WebDriver

from common.tests.core import BaseLiveTestCase, world


IPHONE6_WIDTH = 375
IPHONE6_HEIGHT = 627
IPHONE6_USER_AGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, ' \
                    'like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4'


class BaseLivePhoneTestCase(BaseLiveTestCase):
    def setUp(self):
        # TODO: Need a refactor here after merge the branch 'improve-test-running-time'
        if world.browser is None:
            profile = webdriver.FirefoxProfile()
            profile.set_preference(
                'general.useragent.override',
                IPHONE6_USER_AGENT
            )
            world.browser = WebDriver(profile)
            world.browser.implicitly_wait(10)
            world.browser.set_window_size(width=375, height=627)


class RedirectMobileTest(BaseLivePhoneTestCase):
    def test_redirect_phone_to_mobile_site(self):
        any_uri = '/any_uri'

        self.visit(any_uri)
        expected_url = '{mobile_subdomain}{uri}'.format(mobile_subdomain=settings.SITE_INFO['mobile_host'], uri=any_uri)

        self.browser.current_url.should.contain(expected_url)
