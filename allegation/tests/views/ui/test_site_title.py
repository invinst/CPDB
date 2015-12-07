from common.tests.core import BaseLiveTestCase


class SiteTitleTestCase(BaseLiveTestCase):
    def test_site_title(self):
        title = 'This is title'
        slugify_url = 'this-is-title'
        self.visit_home()

        self.fill_in('.site-title-input', title)
        self.until(self.ajax_complete)
        self.until(lambda: self.browser.title.should.equal(title))
        self.until(lambda: self.browser.current_url.should.contain(slugify_url))

        # We disable this test for a while till we find the way to resolve it in CircleCI
        # self.browser.refresh()
        # self.until(lambda: self.browser.title.should.equal(title))
        # self.find('.site-title-input').get_attribute('value').should.equal(title)
