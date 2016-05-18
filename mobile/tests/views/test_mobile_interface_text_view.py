from django.core.urlresolvers import reverse
from rest_framework.status import HTTP_200_OK

from api.models import InterfaceText
from common.tests.core import SimpleTestCase


class MobileInterfaceTextTest(SimpleTestCase):
    def call_interface_text_api(self, params={}):
        response = self.client.get(reverse('mobile:mobile-interface-text'), params)
        data = self.json(response)

        return response, data

    def test_successfully_call_the_api(self):
        interface_text = InterfaceText.objects.create(
            key='summary-help-text', text='This is summary text as provided by the Chicago Police Department')

        response, data = self.call_interface_text_api()
        response.status_code.should.equal(HTTP_200_OK)
        data['results'].should.have.length_of(1)
        data['results'][0]['id'].should.be.equal(interface_text.id)
