from django.core import management

from api.models import InterfaceText
from common.tests.core import SimpleTestCase


class InsertThankYouMessageInterfaceTextTestCase(SimpleTestCase):
    def test_insert_thankyou_message(self):
        management.call_command('insert_thankyou_message_interface_text')
        message = InterfaceText.objects.filter(key='thank-you-message').first()
        message.text.should.contain('Someone from our team will write a Freedom of Information Act Request')
