import faker

from allegation.factories import AllegationFactory
from common.tests.core import BaseLiveTestCase


class RequestViewTestCase(BaseLiveTestCase):
    def test_request_document(self):
        # create 2 allegations
        AllegationFactory()
        AllegationFactory()

        self.visit_home()
        self.find(".officer .checkmark").click()
        self.until(lambda: self.find(".complaint-row .btn-request").click())

        # the modal should shown
        self.find("#request_modal").is_displayed().should.be.true
        self.see_header_text()

        # enter email
        self.fill_in("#request_modal input[name='email']", faker.Faker().email())
        self.button("Submit").click()
        self.see_notify_text()

        self.check_button_requested()

        # check the button text after reload
        self.browser.refresh()
        self.check_button_requested()

    def see_notify_text(self):
        self.until(lambda: self.should_see_text("Thank you!"))
        self.should_see_text('Someone from our')

    def see_header_text(self):
        self.should_see_text("We'll notify you when the document is made available.")

    def check_button_requested(self):
        self.find(".complaint-row .btn-request").text.should.equal('Pending')
