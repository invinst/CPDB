import faker
from allegation.factories import AllegationFactory
from common.tests.core import BaseLiveTestCase


class RequestViewTestCase(BaseLiveTestCase):
    def test_request_document(self):
        # create 2 allegations
        AllegationFactory()
        AllegationFactory()

        self.visit('/')
        self.find(".officer .checkmark").click()
        self.until(lambda: self.find(".complaint-row .btn-request").click())

        # the modal should shown
        self.find("#request_modal").is_displayed().should.be.true
        self.should_see_text("We'll notify you when the document is made available.")

        # enter email
        self.find("#request_modal input[name='email']").send_keys(faker.Faker().email())
        self.button("Submit").click()

        # wait until modal hide
        self.until(lambda: not self.find("#request_modal").is_displayed())
        # still see the text as successfully notification
        self.should_see_text("We'll notify you when the document is made available.")
        self.find(".complaint-row .btn-request").text.should.equal('Requested')

        # check the button text after reload
        self.browser.refresh()
        self.find(".complaint-row .btn-request").text.should.equal('Requested')
