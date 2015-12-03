from allegation.factories import AllegationFactory
from common.models import Allegation
from common.tests.core import SimpleTestCase
from document.factories import RequestEmailFactory
from document.models.document_request_query_set import DocumentRequestQuerySet


class DocumentModelTestCase(SimpleTestCase):
    def test_query_set(self):
        crid = '100'
        allegation = AllegationFactory(crid=crid, document_pending=False, document_requested=True, document_id=0)
        document_requestemail_1 = RequestEmailFactory(crid=crid)
        document_requestemail_2 = RequestEmailFactory(crid=crid)

        result = DocumentRequestQuerySet().get_filter()

        len(result).should.equal(1)
        result = result[0]
        result.emails.should.contain(document_requestemail_1.email)
        result.emails.should.contain(document_requestemail_2.email)
