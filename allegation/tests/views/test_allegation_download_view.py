from unittest import mock
from django.http.response import FileResponse

from allegation.factories import AllegationFactory, DownloadFactory
from allegation.models import Download
from common.tests.core import SimpleTestCase


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
