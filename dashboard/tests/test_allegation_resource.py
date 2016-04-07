from datetime import datetime

from common.tests.core import SimpleTestCase
from dashboard.admin import DocumentResource
from document.factories import DocumentFactory


class DocumentResourceTestCase(SimpleTestCase):
    def setUp(self):
        self.document = DocumentFactory(documentcloud_id=None)

    def test_dehydrate_status(self):
        self.document.requested = None
        DocumentResource().dehydrate_status(self.document).should.equal('Missing')

        self.document.requested = True
        self.document.pending = True
        DocumentResource().dehydrate_status(self.document).should.equal('Pending')

        self.document.pending = False
        DocumentResource().dehydrate_status(self.document).should.equal('Request')

        self.document.documentcloud_id = 1
        DocumentResource().dehydrate_status(self.document).should.equal('Fulfilled')

    def test_dehydrate_last_requested(self):
        expected_result = '11:12 AM, 09 Oct 2015'

        self.document.last_requested = datetime(day=9, month=10, year=2015, hour=11, minute=12)
        result = DocumentResource().dehydrate_last_requested(self.document)

        result.should.equal(expected_result)
