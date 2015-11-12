import faker

from allegation.factories import AllegationFactory
from common.tests.core import BaseLiveTestCase


class RequestViewTestCase(BaseLiveTestCase):
    def test_request_document(self):
        # create 2 allegations
        AllegationFactory()
        AllegationFactory()

        self.visit('/#!/data-tools')
        self.find(".officer .checkmark").click()
        self.until(lambda: self.find(".complaint-row .btn-request").click())

        # the modal should shown
        self.find("#request_modal").is_displayed().should.be.true
        self.see_header_text()

        # enter email
        self.find("#request_modal input[name='email']").send_keys(faker.Faker().email())
        self.button("Submit").click()

        # wait until modal hide
        self.until(lambda: not self.find("#request_modal").is_displayed())
        self.see_notify_text()
        # still see the text as successfully notification

        self.check_button_requested()

        # check the button text after reload
        self.browser.refresh()
        self.check_button_requested()

    def see_notify_text(self):
        self.should_see_text("Thank you! Someone from our")

    def see_header_text(self):
        self.should_see_text("We'll notify you when the document is made available.")

    def check_button_requested(self):
        self.find(".complaint-row .btn-request").text.should.equal('Requested')
