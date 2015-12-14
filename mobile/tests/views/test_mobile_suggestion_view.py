from django.core.urlresolvers import reverse
from rest_framework.status import HTTP_200_OK

from allegation.factories import AllegationFactory
from common.tests.core import SimpleTestCase


class MobileSuggestionViewTest(SimpleTestCase):
    def call_mobile_suggestion_api(self, params={}):
        response = self.client.get(reverse('mobile:suggestion'), params)
        data = self.json(response)

        return response, data

    def test_mobile_suggestion_view_should_be_ok(self):
        response, data = self.call_mobile_suggestion_api()
        response.status_code.should.equal(HTTP_200_OK)

    def test_mobile_suggestion_view_should_return_suggestion_for_allegation(self):
        allegation = AllegationFactory()
        params = {
            'query': allegation.crid
        }

        response, data = self.call_mobile_suggestion_api(params)

        len(data).should.equal(1)
        data[0]['resource'].should.equal('allegation')
        data[0]['resource_key'].should.equal(str(allegation.crid))
