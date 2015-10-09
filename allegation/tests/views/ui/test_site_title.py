from common.tests.core import BaseLiveTestCase
from allegation.views import DEFAULT_SITE_TITLE


class SiteTitleTestCase(BaseLiveTestCase):
    def test_site_title(self):
        title = 'This is title'
        slugify_url = 'this-is-title'
        self.visit('/#!/data-tools')
        self.browser.title.should.equal(DEFAULT_SITE_TITLE)

        self.fill_in('.site-title-input', title)
        self.until(self.ajax_complete)
        self.browser.title.should.equal(title)
        self.browser.current_url.should.contain(slugify_url)


        # We disable this test for a while till we find the way to resolve it in CircleCI
        # self.browser.refresh()
        # self.until(lambda: self.browser.title.should.equal(title))
        # self.find('.site-title-input').get_attribute('value').should.equal(title)
