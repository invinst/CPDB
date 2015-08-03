from django.http.response import FileResponse

from allegation.factories import AllegationFactory
from common.tests.core import SimpleTestCase


class AllegationDownloadViewTestCase(SimpleTestCase):

    def setUp(self):
        AllegationFactory()

    def test_response_type(self):
        response = self.client.get("/allegations/download/")

        response.status_code.should.equal(200)
        isinstance(response, FileResponse).should.be.true
