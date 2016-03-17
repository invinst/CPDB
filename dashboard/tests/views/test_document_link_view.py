import json

from django.core import mail

from common.tests.core import SimpleTestCase
from document.factories import RequestEmailFactory, DocumentFactory
from api.models import Setting


class DocumentLinkViewTestCase(SimpleTestCase):
    _multiprocess_can_split_ = True

    def setUp(self):
        self.login_user()

    def test_add_link(self):
        document = DocumentFactory()
        allegation = document.allegation
        allegation.crid = 1002643
        allegation.save()

        crid = allegation.crid
        documentcloud_id = 1273509
        normalized_title = 'cr-{crid}'.format(crid=crid)
        title = 'CR {crid}'.format(crid=crid)
        Setting.objects.create(
            default_site_title='CPDB',
            story_types_order='',
            requested_document_email_subject='{crid}',
            requested_document_email_text='{crid} {link}'
        )

        RequestEmailFactory(document=document)

        response = self.client.post('/api/dashboard/document-link/', {
            'link': 'https://www.documentcloud.org/documents/%s-%s.html' % (
                documentcloud_id, normalized_title)
        })
        response.status_code.should.equal(200)
        content = json.loads(response.content.decode())
        content['crid'].should.contain(str(crid))

        document.refresh_from_db()
        document.documentcloud_id.should.equal(documentcloud_id)
        document.normalized_title.should.equal(normalized_title)
        document.title.should.equal(title)

        # email notification
        len(mail.outbox).should.equal(1)

    def test_add_no_link(self):
        response = self.client.post('/api/dashboard/document-link/', {
            'link': ''
        })

        response.status_code.should.equal(400)

    def test_add_link_not_avaiable_for_request(self):
        response = self.client.post('/api/dashboard/document-link/', {
            'link': 'http://www.documentcloud.txt/documents/000-aaa-000.html'
        })

        response.status_code.should.equal(400)

    def test_add_non_exist_link(self):
        response = self.client.post('/api/dashboard/document-link/', {
            'link': 'https://www.documentcloud.org/documents/000-cr-000.html'
        })

        response.status_code.should.equal(400)
        content = json.loads(response.content.decode())
        content['errors'].should.contain('Invalid document link')

    def test_add_trash_link(self):
        response = self.client.post('/api/dashboard/document-link/', {
            'link': 'dsadsad'
        })

        response.status_code.should.equal(400)
