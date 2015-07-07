from common.tests.core import BaseLiveTestCase


DEFAULT_SITE_TITLE = 'Police Misconduct in Chicago'


class SiteTitleTestCase(BaseLiveTestCase):
    def test_site_title(self):
        title = 'This is title'
        self.visit('/')
        self.browser.title.should.equal(DEFAULT_SITE_TITLE)
        self.fill_in('.site-title-input', title)

        self.browser.title.should.equal(title)

        # Revisit current url should not change the title
        self.browser.get(self.browser.current_url)
        self.browser.title.should.equal(title)
        self.find('.site-title-input').get_attribute('value').should.equal(title)
