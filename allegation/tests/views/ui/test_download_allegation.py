import requests

from allegation.factories import AllegationFactory
from common.tests.core import BaseLiveTestCase


class DownloadAllegationTestCase(BaseLiveTestCase):
    def test_download(self):
        AllegationFactory()

        self.visit_home()
        self.find('.officer .checkmark').click()

        self.browser.execute_script("window.redirect = function () {};")  # disable redirect to download excel file on testing

        link = lambda: self.find(".download-wrapper a")
        self.until(lambda: self.find('.download-wrapper a'))
        link().click()
        self.find('.download-wrapper').text.should.equal('Processing')

        self.until(lambda: self.find('.download-wrapper').text != 'Processing')

        href = link().get_attribute('href')

        download_response = requests.head(href)
        download_response.status_code.should.equal(200)
        download_response.headers['content-type'].should.contain('application/')

        self.find('.officer .checkmark').click()  # deactivate officer
        self.find(".download-wrapper a").is_displayed().should.be.false

        self.find('.officer .checkmark').click()  # active officer
        link().is_displayed().should.be.true
        link().get_attribute('href').shouldnt.equal(href)

        link().click()
        self.find('.download-wrapper').text.should.equal('Processing')
