from common.tests.core import SimpleTestCase


class Handle404TestCase(SimpleTestCase):
    def test_404_redirect_to_home(self):
        response = self.client.get("/not-found-page/")
        
        response.status_code.should.equal(302)
        response['location'].should.equal('http://testserver/')
