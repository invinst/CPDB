import os
import xlrd

from unittest import mock

from django.conf import settings

from allegation.factories import AllegationFactory, DownloadFactory, OfficerAllegationFactory
from allegation.models import Download
from allegation.services.download_allegations import AllegationsDownload
from common.tests.core import SimpleTestCase
from share.factories import SettingFactory


class AllegationDownloadViewTestCase(SimpleTestCase):

    URL = "/allegations/download/"

    def setUp(self):
        AllegationFactory()

    def test_request_no_download_id(self):
        response = self.client.get(self.URL)

        response.status_code.shouldnt.equal(200)

    def test_request_download_info(self):
        download = DownloadFactory()
        response = self.client.get(self.URL, {'id': download.id})

        response.status_code.should.equal(200)

        data = self.json(response)
        data['download']['id'].should.equal(download.id)

    def test_create_download_file(self):
        with mock.patch('allegation.views.allegation_download_view.download_allegations') as mock_obj:
            response = self.client.post("/allegations/download/?abc=def")

        response.status_code.should.equal(200)

        data = self.json(response)
        data.should.contain('download')

        Download.objects.get(pk=data['download']['id']).query.should.equal('abc=def')

        mock_obj.delay.called.should.be.true

    def test_lat_lng_in_download(self):
        allegation = AllegationFactory()
        OfficerAllegationFactory(allegation=allegation)
        SettingFactory()

        download = DownloadFactory(query="allegation__crid=%s" % allegation.crid)
        AllegationsDownload(download.id).generate()

        download.refresh_from_db()
        excel_file = os.path.join(settings.MEDIA_ROOT, download.url)

        book = xlrd.open_workbook(excel_file)

        book.sheets()[1].cell(1, 23).value.should.equal(allegation.point.y)
        book.sheets()[1].cell(1, 24).value.should.equal(allegation.point.x)
