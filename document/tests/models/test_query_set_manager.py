from common.tests.core import SimpleTestCase
from document.factories import DocumentFactory


class QuerySetManagerTestCase(SimpleTestCase):
    def test_update_auto_set_document_status(self):
        document = DocumentFactory(requested=True, pending=True)

        # Update document with documentcloud id
        document.update(documentcloud_id=1)

        document.refresh_from_db()
        document.requested.should.be.false
        document.pending.should.be.false

        # Update document pending
        document.update(pending=False)

        document.refresh_from_db()
        document.requested.should.be.true
        document.documentcloud_id.should.equal(0)

    def test_force_update_document_status(self):
        document = DocumentFactory(requested=True, pending=True)

        # Update document with documentcloud id
        document.update(requested=True, pending=True, documentcloud_id=1)

        document.refresh_from_db()
        document.requested.should.be.true
        document.pending.should.be.true

        # Update document pending
        document.update(requested=False, pending=False, documentcloud_id=1)

        document.refresh_from_db()
        document.requested.should.be.false
        document.documentcloud_id.should.equal(1)
