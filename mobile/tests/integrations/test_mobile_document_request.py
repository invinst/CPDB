from allegation.factories import AllegationFactory, AllegationCategoryFactory, OfficerAllegationFactory
from common.tests.core import BaseLivePhoneTestCase
from document.factories import DocumentFactory


class MobileDocumentRequestTest(BaseLivePhoneTestCase):
    def setUp(self):
        self.category = AllegationCategoryFactory()
        self.allegation = AllegationFactory()
        DocumentFactory(documentcloud_id=None, requested=False, allegation=self.allegation)
        OfficerAllegationFactory(cat=self.category, allegation=self.allegation)

    def test_request_document_successfully(self):
        email = 'test@gmail.com'
        self.visit_complaint_page(self.allegation.crid, self.category.id)
        self.find('.action-type').text.should.be.equal('Request')
        self.until(lambda: self.find('.action-type')).click()
        self.until(lambda: self.find('.email-input').send_keys(email))

        element = self.until(lambda: self.find('.btn-submit'))
        element.click()

        self.until(lambda: self.find('.thank-you').text.should.contain('Thank you'))

    def test_modal_close_when_clicking_cancel(self):
        self.visit_complaint_page(self.allegation.crid, self.category.id)
        self.find('.action-type').text.should.be.equal('Request')
        self.until(lambda: self.find('.action-type')).click()
        content = self.until(lambda: self.find('.modal-body'))
        content.text.should.contain('We\'ll notify you')

        cancelBtn = self.until(lambda: self.find('.btn-cancel'))
        cancelBtn.click()

        self.find('.allegation-name').text.should.be.equal(self.category.allegation_name)

    def test_submit_invalid_email_stay_the_same(self):
        invalid_email = 'invalid'
        self.visit_complaint_page(self.allegation.crid, self.category.id)
        self.find('.action-type').text.should.be.equal('Request')
        self.until(lambda: self.find('.action-type')).click()
        self.until(lambda: self.find('.email-input').send_keys(invalid_email))

        element = self.until(lambda: self.find('.btn-submit'))
        element.click()

        self.until(lambda: self.find('.modal-body').text.should.contain('We\'ll notify you'))
