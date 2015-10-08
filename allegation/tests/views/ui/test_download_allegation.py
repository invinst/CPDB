import requests

from allegation.factories import AllegationFactory
from common.tests.core import BaseLiveTestCase


class DownloadAllegationTestCase(BaseLiveTestCase):
    def test_download(self):
        AllegationFactory()

        self.visit('/#!/data-tools')
        self.find('.officer .checkmark').click()

        self.until(lambda: self.find('.download-wrapper a'))
        self.find('.download-wrapper a').click()
        self.find('.download-wrapper').text.should.equal('Processing')

        self.until(lambda: self.find('.download-wrapper').text != 'Processing')
        link = self.find(".download-wrapper a")
        href = link.get_attribute('href')

        download_response = requests.head(href)
        download_response.status_code.should.equal(200)
        download_response.headers['content-type'].should.contain('application/')
