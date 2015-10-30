from allegation.factories import AllegationFactory
from common.models import Allegation
from common.tests.core import SimpleTestCase


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
            'crid': ['This field is required.'],
            'status': ['This field is required.'],
        })

    def test_crid_not_found(self):
        response = self.client.post('/api/dashboard/document-request-status/', {
            'crid': 1000111,
            'status': 'pending'
        })
        response.status_code.should.equal(400)

        self.check_error(response, {
            'crid': ['CRID not found'],
        })

    def test_status_undefined(self):
        crid = 1000111
        status = 'waiting for Half-life 3'
        AllegationFactory(crid=crid)

        response = self.client.post('/api/dashboard/document-request-status/', {
            'crid': crid,
            'status': status
        })
        response.status_code.should.equal(400)

        self.check_error(response, {
            'status': ['Select a valid choice. %s is not one of the available choices.' % status],
        })

    def test_pending_unrequested_document(self):
        allegation = AllegationFactory(document_requested=False)

        response = self.client.post('/api/dashboard/document-request-status/', {
            'crid': allegation.crid,
            'status': 'pending'
        })
        response.status_code.should.equal(400)

        self.check_error(response, {
            '__all__': ['This document cannot be assigned that status'],
        })

    def test_pending_already_pending_document(self):
        allegation = AllegationFactory(document_requested=True, document_pending=True)

        response = self.client.post('/api/dashboard/document-request-status/', {
            'crid': allegation.crid,
            'status': 'pending'
        })
        response.status_code.should.equal(400)

        self.check_error(response, {
            '__all__': ['This document cannot be assigned that status'],
        })

    def test_pending_fulfilled_document(self):
        allegation = AllegationFactory(document_id=1)

        response = self.client.post('/api/dashboard/document-request-status/', {
            'crid': allegation.crid,
            'status': 'pending'
        })
        response.status_code.should.equal(400)

        self.check_error(response, {
            '__all__': ['This document cannot be assigned that status'],
        })

    def test_pending_valid(self):
        allegation = AllegationFactory(document_requested=True, document_pending=False)

        response = self.client.post('/api/dashboard/document-request-status/', {
            'crid': allegation.crid,
            'status': 'pending'
        })
        response.status_code.should.equal(200)

        len(Allegation.objects.filter(crid=allegation.crid, document_requested=True, document_pending=True)).should.equal(1)

    def test_set_requesting(self):
        allegation = AllegationFactory()

        response = self.client.post('/api/dashboard/document-request-status/', {
            'crid': allegation.crid,
            'status': 'requesting'
        })
        response.status_code.should.equal(200)

        len(Allegation.objects.filter(crid=allegation.crid, document_requested=True)).should.equal(1)
