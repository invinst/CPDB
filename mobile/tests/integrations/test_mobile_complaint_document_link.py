from allegation.factories import OfficerAllegationFactory
from common.tests.core import BaseLivePhoneTestCase, BaseLiveAndroidPhoneTestCase
from document.factories import DocumentFactory


class MobileComplaintDocumentTestMixin():
    def setUp(self):
        document = DocumentFactory(type='CR', documentcloud_id='1678325', normalized_title='cr-1059875')
        self.allegation = document.allegation
        OfficerAllegationFactory(allegation=self.allegation)


class MobileComplaintDocumentAndroidTest(MobileComplaintDocumentTestMixin, BaseLiveAndroidPhoneTestCase):
    def test_view_cloud_pdf(self):
        view_document_link = 'http://documentcloud.org/documents/1678325-cr-1059875.html'
        self.visit_complaint_page(self.allegation)
        self.find('.document-link').get_attribute('href').should.equal(view_document_link)


class MobileComplaintDocumentIOSTest(MobileComplaintDocumentTestMixin, BaseLivePhoneTestCase):
    def test_view_pdf_directly(self):
        view_document_link = 'http://documentcloud.org/documents/1678325-cr-1059875.pdf'
        self.visit_complaint_page(self.allegation)
        self.find('.document-link').get_attribute('href').should.equal(view_document_link)
