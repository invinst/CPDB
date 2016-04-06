from common.tests.core import SimpleTestCase
from document.factories import RequestEmailFactory, DocumentFactory
from document.models import Document


class DocumentModelTestCase(SimpleTestCase):
    def test_update_num_requests(self):
        document = DocumentFactory()

        num_requests = document.number_of_request
        RequestEmailFactory(document=document)

        Document.objects.get(id=document.id).number_of_request.should.equal(num_requests + 1)
