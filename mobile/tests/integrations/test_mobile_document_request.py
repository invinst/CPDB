from allegation.factories import AllegationFactory, AllegationCategoryFactory, OfficerAllegationFactory
from common.tests.core import BaseLivePhoneTestCase
from document.factories import DocumentFactory


class MobileDocumentRequestTest(BaseLivePhoneTestCase):
    def test_request_document_successfully(self):
        email = 'test@gmail.com'
        category = AllegationCategoryFactory()
        allegation = AllegationFactory()
        DocumentFactory(documentcloud_id=None, requested=False, allegation=allegation)
        OfficerAllegationFactory(cat=category, allegation=allegation)
        self.visit_complaint_page(allegation.crid, category.id)
        self.find('.action-type').text.should.be.equal('Request')
        self.until(lambda: self.find('.action-type')).click()
        self.find('.email-input').send_keys(email)
        element = self.until(lambda: self.find('.btn-submit'))
        element.click()
        self.should_see_text('Thank you', '.message-header')
