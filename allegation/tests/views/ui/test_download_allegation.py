import time
from unittest import mock
import requests

from allegation.factories import AllegationFactory, PoliceWitnessFactory, ComplainingWitnessFactory
from common.tests.core import BaseLiveTestCase


class DownloadAllegationTestCase(BaseLiveTestCase):
    def setUp(self):
        super(DownloadAllegationTestCase, self).setUp()
        allegation = AllegationFactory()
        PoliceWitnessFactory(crid=allegation.crid)
        ComplainingWitnessFactory(crid=allegation.crid)

        self.visit_home()
        self.browser.execute_script("window.redirect = function () {};")  # disable redirect to download excel file on testing

        self.click_first_officer()
        self.until(lambda: self.download_link.is_displayed())

    @property
    def download_link(self):
        return self.find(".download-wrapper a")

    def test_show_processing(self):
        self.download_link.click()
        self.until(lambda: self.find('.download-wrapper').text.should.equal('Processing'))
        self.until(lambda: self.find('.download-wrapper').text != 'Processing')
        self.download_link.get_attribute('href').should.contain('xlsx')

    def test_download(self):
        self.download_link.click()
        self.until(lambda: 'xlsx' in self.download_link.get_attribute('href'))

        href = self.download_link.get_attribute('href')

        download_response = requests.head(href)
        download_response.status_code.should.equal(200)
        download_response.headers['content-type'].should.contain('application/')

        self.click_first_officer()  # deactivate officer
        self.download_link.is_displayed().should.be.false

        self.click_first_officer()  # active officer
        self.download_link.is_displayed().should.be.true
        self.download_link.get_attribute('href').shouldnt.equal(href)

        self.download_link.click()
        self.find('.download-wrapper').text.should.equal('Processing')
        self.until(lambda: self.browser.execute_script("clearInterval(window.downloadListener);") and self.ajax_complete())

