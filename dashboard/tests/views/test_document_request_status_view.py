from common.tests.core import SimpleTestCase
from document.factories import DocumentFactory
from document.models import Document


class DocumentRequestStatusViewTestCase(SimpleTestCase):
    def setUp(self):
        self.login_user()

    def check_error(self, response, errors_by_fields):
        response_json = self.json(response)
        response_json.should.contain('errors')

        errors = response_json['errors']
        for field in errors_by_fields:
            errors[field].should.equal(errors_by_fields[field])

    def test_param_missing(self):
        response = self.client.post('/api/dashboard/document-request-status/', {})
        response.status_code.should.equal(400)

        self.check_error(response, {
            'id': ['This field is required.'],
            'status': ['This field is required.'],
        })

    def test_id_not_found(self):
        response = self.client.post(
            '/api/dashboard/document-request-status/', {
                'id': 1000111,
                'status': 'pending'
            })
        response.status_code.should.equal(400)

        self.check_error(response, {
            'id': ['Document not found'],
        })

    def test_status_undefined(self):
        status = 'waiting for Half-life 3'
        document = DocumentFactory()

        response = self.client.post('/api/dashboard/document-request-status/', {
            'id': document.id,
            'status': status
        })
        response.status_code.should.equal(400)

        self.check_error(response, {
            'status': ['Select a valid choice. %s is not one of the available choices.' % status],
        })

    def test_pending_unrequested_document(self):
        document = DocumentFactory(requested=False)

        response = self.client.post('/api/dashboard/document-request-status/', {
            'id': document.id,
            'status': 'pending'
        })
        response.status_code.should.equal(400)

        self.check_error(response, {
            '__all__': ['This document cannot be assigned that status'],
        })

    def test_pending_already_pending_document(self):
        document = DocumentFactory(requested=True, pending=True)

        response = self.client.post('/api/dashboard/document-request-status/', {
            'id': document.id,
            'status': 'pending'
        })
        response.status_code.should.equal(400)

        self.check_error(response, {
            '__all__': ['This document cannot be assigned that status'],
        })

    def test_pending_fulfilled_document(self):
        document = DocumentFactory(documentcloud_id=1)

        response = self.client.post('/api/dashboard/document-request-status/', {
            'id': document.id,
            'status': 'pending'
        })
        response.status_code.should.equal(400)

        self.check_error(response, {
            '__all__': ['This document cannot be assigned that status'],
        })

    def test_pending_valid(self):
        document = DocumentFactory(requested=True, pending=False)

        response = self.client.post('/api/dashboard/document-request-status/', {
            'id': document.id,
            'status': 'pending'
        })
        response.status_code.should.equal(200)

        len(Document.objects.filter(id=document.id, requested=True, pending=True)).should.equal(1)

    def test_set_requesting(self):
        document = DocumentFactory()

        response = self.client.post('/api/dashboard/document-request-status/', {
            'id': document.id,
            'status': 'requesting'
        })
        response.status_code.should.equal(200)

        len(Document.objects.filter(pk=document.id, requested=True)).should.equal(1)

    def test_cancel_document_requests(self):
        document = DocumentFactory(requested=True, number_of_request=10)

        response = self.client.post('/api/dashboard/document-request-status/', {
            'id': document.id,
            'status': 'missing'
        })

        response.status_code.should.equal(200)

        len(Document.objects.filter(pk=document.id, requested=False)).should.equal(1)
