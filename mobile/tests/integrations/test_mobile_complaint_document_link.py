
from allegation.factories import AllegationFactory, OfficerAllegationFactory
from common.tests.core import BaseLivePhoneTestCase, BaseLiveAndroidPhoneTestCase

class MobileComplaintDocumentTestMixin():
    def go_to_allegation_detail_page(self, crid=''):
        self.visit('/mobile/complaint/{crid}'.format(crid=crid))

    def setUp(self):
        document_id = '1678325'
        document_normalized_title = 'cr-1059875'
        self.allegation = AllegationFactory(document_normalized_title=document_normalized_title, document_id=document_id)
        OfficerAllegationFactory(allegation=self.allegation)

class MobileComplaintDocumentAndroidTest(MobileComplaintDocumentTestMixin, BaseLiveAndroidPhoneTestCase):
    def test_view_cloud_pdf(self):
        view_document_link = 'http://documentcloud.org/documents/1678325-cr-1059875.html'
        self.go_to_allegation_detail_page(crid=self.allegation.crid)
        self.find('.document-link').get_attribute('href').should.equal(view_document_link)


class MobileComplaintDocumentIOSTest(MobileComplaintDocumentTestMixin, BaseLivePhoneTestCase):

    def test_view_pdf_directly(self):
        view_document_link = 'http://documentcloud.org/documents/1678325-cr-1059875.pdf'
        self.go_to_allegation_detail_page(crid=self.allegation.crid)
        self.find('.document-link').get_attribute('href').should.equal(view_document_link)
