import json
from mock import patch, MagicMock

from django.core.urlresolvers import reverse

from rest_framework import status

from common.tests.core import SimpleTestCase
from allegation.factories import AllegationFactory
from document.models import Document


class AdminUploadDocumentTestCase(SimpleTestCase):
    def setUp(self):
        self.login_user()

    def test_upload_document(self):
        crid = '123456'
        doc_id = '111111'
        title = 'CR %s' % crid
        AllegationFactory(crid=crid)
        upload_func = MagicMock(return_value=(
            status.HTTP_200_OK,
            {'canonical_url': 'https://www.documentcloud.org/documents/%s-cr-%s.html' % (doc_id, crid)}))

        with patch('dashboard.services.documentcloud_service.DocumentcloudService.upload_document', new=upload_func):
            response = self.client.post(
                reverse('document-upload'),
                {
                    'file': 'mock_pdf_file',
                    'title': title,
                    'source': 'source',
                    'document_type': 'CR'
                },
                format='multipart'
                )

        response.status_code.should.equal(status.HTTP_200_OK)
        content = json.loads(response.content.decode())
        content['crid'].should.equal(crid)

        complain = Document.objects.get(allegation__crid=crid, type='CR')
        str(complain.documentcloud_id).should.equal(doc_id)
        complain.normalized_title.should.equal('cr-%s' % crid)
        complain.title.should.equal(title)

    def test_upload_document_without_source(self):
        crid = '234567'
        title = 'CR %s' % crid
        AllegationFactory(crid=crid)
        upload_func = MagicMock(return_value=(
            status.HTTP_200_OK, {'canonical_url': 'https://www.documentcloud.org/documents/123-cr-%s.html' % crid}))

        with patch('dashboard.services.documentcloud_service.DocumentcloudService.upload_document', new=upload_func):
            response = self.client.post(
                reverse('document-upload'),
                {
                    'file': 'mock_pdf_file',
                    'title': title,
                    'document_type': 'CR'
                },
                format='multipart'
                )

        response.status_code.should.equal(status.HTTP_200_OK)

    def test_upload_to_document_cloud_failed(self):
        error_message = {'error': 'Bad request'}
        upload_func = MagicMock(return_value=(status.HTTP_400_BAD_REQUEST, error_message))
        with patch('dashboard.services.documentcloud_service.DocumentcloudService.upload_document', new=upload_func):
            response = self.client.post(
                reverse('document-upload'),
                {
                    'title': 'bad form data',
                    'source': '',
                    'file': '',
                    'document_type': 'CR'
                },
                format='multipart'
                )
        response.status_code.should.equal(status.HTTP_400_BAD_REQUEST)
        content = json.loads(response.content.decode())
        content['documentCloudMessage'].should.equal(error_message)

    def test_update_allegation_failed(self):
        upload_func = MagicMock(return_value=(status.HTTP_200_OK, {'canonical_url': ''}))
        with patch('dashboard.services.documentcloud_service.DocumentcloudService.upload_document', new=upload_func):
            response = self.client.post(
                reverse('document-upload'),
                {
                    'title': '12345678',
                    'source': '',
                    'file': '',
                    'document_type': 'CR'
                },
                format='multipart'
                )
        response.status_code.should.equal(status.HTTP_400_BAD_REQUEST)
        content = json.loads(response.content.decode())
        content['errors'].should.equal(['Invalid document link'])
