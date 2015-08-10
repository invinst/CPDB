import requests

from allegation.factories import AllegationFactory
from common.tests.core import BaseLiveTestCase


class DownloadAllegationTestCase(BaseLiveTestCase):
    def test_download(self):
        AllegationFactory()

        self.visit('/')
        self.find('.officer .checkmark').click()

        self.until(lambda: self.find('.download-wrapper .btn-download'))
        self.find('.download-wrapper .btn-download').click()
        self.find('.download-wrapper').text.should.equal('Processing')

        self.until(lambda: self.find('.download-wrapper').text != 'Processing')
        link = self.find(".download-wrapper .btn-download")
        href = link.get_attribute('href')

        download_response = requests.head(href)
        download_response.status_code.should.equal(200)
        download_response.headers['content-type'].should.contain('application/')
