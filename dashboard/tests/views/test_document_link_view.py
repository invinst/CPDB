import json
from allegation.factories import AllegationFactory
from common.models import Allegation
from common.tests.core import SimpleTestCase


class DocumentLinkViewTestCase(SimpleTestCase):
    _multiprocess_can_split_ = True
    def setUp(self):
        self.login_user()

    def test_add_link(self):
        crid = 1002643
        document_id = 1273509
        normalized_title = 'cr-{crid}'.format(crid=crid)
        title = 'CR {crid}'.format(crid=crid)
        AllegationFactory(crid=crid, document_id=0, document_normalized_title='', document_title='')
        response = self.client.post('/api/dashboard/document-link/', {
            'link': 'https://www.documentcloud.org/documents/%s-%s.html' % (document_id, normalized_title)
        })

        response.status_code.should.equal(200)
        content = json.loads(response.content.decode())
        content['crid'].should.contain(str(crid))
        allegation = Allegation.objects.filter(crid=crid).first()
        allegation.document_id.should.equal(document_id)
        allegation.document_normalized_title.should.equal(normalized_title)
        allegation.document_title.should.equal(title)

    def test_add_no_link(self):
        response = self.client.post('/api/dashboard/document-link/', {
            'link': ''
        })

        response.status_code.should.equal(400)

    def test_add_non_exist_link(self):
        response = self.client.post('/api/dashboard/document-link/', {
            'link': 'http://www.documentcloud.org/documents/000-aaa-000.html'
        })

        response.status_code.should.equal(400)
        content = json.loads(response.content.decode())
        content['errors'].should.contain('Document not exist')

    def test_add_trash_link(self):
        response = self.client.post('/api/dashboard/document-link/', {
            'link': 'dsadsad'
        })

        response.status_code.should.equal(400)

    def test_cancel_document_requests(self):
        allegation = AllegationFactory()
        response = self.client.post('/api/dashboard/document-link/', {
            'crid': allegation.crid
        })

        response.status_code.should.equal(200)
        for allegation in Allegation.objects.filter(crid=allegation.crid):
            allegation.document_requested.should.be.false
