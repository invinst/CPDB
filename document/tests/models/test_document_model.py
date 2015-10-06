from allegation.factories import AllegationFactory
from common.models import Allegation
from common.tests.core import SimpleTestCase
from document.factories import RequestEmailFactory


class DocumentModelTestCase(SimpleTestCase):
    def test_update_num_requests(self):
        allegation = AllegationFactory()

        num_requests = allegation.number_of_request
        RequestEmailFactory(crid=allegation.crid)

        Allegation.objects.get(id=allegation.id).number_of_request.should.equal(num_requests + 1)
