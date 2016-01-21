from common.tests.core import BaseAdminTestCase
from api.models import Setting, InterfaceText
from officer.factories import StoryFactory


class InterfaceTextEditTestCase(BaseAdminTestCase):
    def setUp(self):
        super(InterfaceTextEditTestCase, self).setUp()
        InterfaceText.objects.create(key='summary-help-text', text='This is summary text as provided by the Chicago Police Department')

    def test_update_interface_text(self):
        self.go_to_section('Interface Texts')
        self.until(self.ajax_complete)
        self.until(lambda: self.find(".fa-pencil"))
        self.find(".fa-pencil").click()

        self.until(lambda: self.find('#id_text'))

        input_field = self.find("#id_text")

        add_text = "Updating the summary text field"
        input_field.send_keys(add_text)

        self.find(".fa-floppy-o").click()
        self.until(self.ajax_complete)
        self.should_see_text("Updating the summary text field")

        InterfaceText.objects.filter(text__contains=add_text).count().should.equal(1)
