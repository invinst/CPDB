from common.tests.core import SimpleTestCase
from document.factories import RequestEmailFactory, DocumentFactory
from document.models.document_request_query_set import DocumentRequestQuerySet


class DocumentModelTestCase(SimpleTestCase):
    def test_query_set(self):
        document = DocumentFactory(pending=False, requested=True, documentcloud_id=0)
        document_requestemail_1 = RequestEmailFactory(document=document)
        document_requestemail_2 = RequestEmailFactory(document=document)

        result = DocumentRequestQuerySet().get_filter(document.type)

        len(result).should.equal(1)
        result = result[0]
        result.emails.should.contain(document_requestemail_1.email)
        result.emails.should.contain(document_requestemail_2.email)
