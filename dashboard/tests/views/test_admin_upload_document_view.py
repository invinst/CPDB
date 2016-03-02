import json
from mock import patch, MagicMock

from django.core.urlresolvers import reverse

from common.tests.core import SimpleTestCase
from allegation.factories import AllegationFactory
from common.models import Allegation


class AdminUploadDocumentTestCase(SimpleTestCase):
    def setUp(self):
        self.login_user()

    def test_upload_document(self):
        crid = '123456'
        doc_id = '111111'
        title = 'CR %s' % crid
        AllegationFactory(crid=crid)
        upload_func = MagicMock(return_value=(
            200, {'canonical_url': 'https://www.documentcloud.org/documents/%s-cr-%s.html' % (doc_id, crid)}))

        with patch('dashboard.views.admin_document_upload_view.upload_cr_document', new=upload_func):
            response = self.client.post(
                reverse('document-upload'),
                {
                    'file': 'mock_pdf_file',
                    'title': title,
                    'source': 'source'
                },
                format='multipart'
                )

        response.status_code.should.equal(200)
        content = json.loads(response.content.decode())
        content['crid'].should.equal(crid)

        complain = Allegation.objects.get(crid=crid)
        str(complain.document_id).should.equal(doc_id)
        complain.document_normalized_title.should.equal('cr-%s' % crid)
        complain.document_title.should.equal(title)

    def test_upload_document_without_source(self):
        crid = '234567'
        title = 'CR %s' % crid
        AllegationFactory(crid=crid)
        upload_func = MagicMock(return_value=(
            200, {'canonical_url': 'https://www.documentcloud.org/documents/123-cr-%s.html' % crid}))

        with patch('dashboard.views.admin_document_upload_view.upload_cr_document', new=upload_func):
            response = self.client.post(
                reverse('document-upload'),
                {
                    'file': 'mock_pdf_file',
                    'title': title
                },
                format='multipart'
                )

        response.status_code.should.equal(200)

    def test_upload_to_document_cloud_failed(self):
        error_message = {'error': 'Bad request'}
        upload_func = MagicMock(return_value=(400, error_message))
        with patch('dashboard.views.admin_document_upload_view.upload_cr_document', new=upload_func):
            response = self.client.post(
                reverse('document-upload'),
                {
                    'title': 'bad form data',
                    'source': '',
                    'file': ''
                },
                format='multipart'
                )
        response.status_code.should.equal(400)
        content = json.loads(response.content.decode())
        content['documentCloudMessage'].should.equal(error_message)

    def test_update_allegation_failed(self):
        upload_func = MagicMock(return_value=(200, {'canonical_url': None}))
        with patch('dashboard.views.admin_document_upload_view.upload_cr_document', new=upload_func):
            response = self.client.post(
                reverse('document-upload'),
                {
                    'title': '12345678',
                    'source': '',
                    'file': ''
                },
                format='multipart'
                )
        response.status_code.should.equal(400)
        content = json.loads(response.content.decode())
        content['errors'].should.equal(['Invalid document link'])
