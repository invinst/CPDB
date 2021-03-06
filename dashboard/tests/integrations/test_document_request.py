from allegation.factories import AllegationFactory
from allegation.tests.constants import TEST_DOCUMENT_URL
from common.models import DocumentCrawler
from common.tests.core import BaseAdminTestCase
from document.factories import DocumentFactory
from document.models import Document


class DocumentRequestTestCase(BaseAdminTestCase):
    def go_to_documents(self):
        self.element_by_tagname_and_text(
            'span', 'Investigation Documents').click()

    def tab(self, text):
        selector = '.tab-{tabname}'.format(tabname=text.lower())
        return self.find(selector)

    def go_to_tab(self, text):
        self.tab(text).click()
        self.until_ajax_complete()

    def tab_should_active(self, text):
        self.tab(text).has_class('active').should.be.true

    def test_see_document_request_tab(self):
        document = DocumentFactory()
        self.should_see_text('Investigation Documents')
        self.go_to_documents()
        self.find('h1').text.should.equal('Investigation Documents')
        self.button('Add document').should.be.ok

        tabs = ['All', 'Missing', 'Requested', 'Fulfilled', 'Pending']
        for tab in tabs:
            self.should_see_text(tab)

        self.tab_should_active("All")

        for tab in tabs:
            self.go_to_tab(tab)
            self.tab_should_active(tab)

        self.go_to_tab('All')
        self.find('.document td').click()
        self.until_ajax_complete()
        self.should_see_text('{crid} information'.format(crid=document.allegation.crid))

    def test_filter_pending_documents(self):
        document = DocumentFactory(requested=True, pending=True)

        self.go_to_documents()
        self.go_to_tab('Pending')

        self.should_see_text(document.allegation.crid)

    def test_change_requesting_to_pending(self):
        document = DocumentFactory(requested=True)

        self.go_to_documents()
        self.go_to_tab('Requested')
        self.button('Request').click()

        self.until(lambda: self.should_see_text('%s document has been requested.' % document.allegation.crid))

        self.go_to_tab('Pending')
        self.should_see_text(document.allegation.crid)
        buttons = [x.text for x in self.find_all('button')]
        buttons.shouldnt.contain('Pending')

    def test_cancel_pending(self):
        document = DocumentFactory(requested=True, pending=True)

        self.go_to_documents()
        self.go_to_tab('Pending')
        self.button('Cancel Pending').click()

        self.until(lambda: self.should_see_text('%s document pending has been cancelled.' % document.allegation.crid))
        self.find_all('.status>span')[-1].text.should.equal('Requested')

        self.go_to_tab('Requested')
        self.should_see_text(document.allegation.crid)

    def test_add_document_link(self):
        allegation = AllegationFactory(crid='1002643')
        document = DocumentFactory(allegation=allegation)

        self.go_to_documents()
        self.button('Add document').click()
        self.until(lambda: self.should_see_text('Add document link'))

        self.element_for_label('Enter URL').send_keys(TEST_DOCUMENT_URL)
        self.button('SUBMIT').click()
        self.until(lambda: self.should_see_text(
            'The document is successfully added to allegation #{crid}!'.format(
                crid=document.allegation.crid)))

    def test_error_adding_link(self):
        DocumentFactory()

        self.go_to_documents()
        self.button("Add document").click()
        self.until(lambda: self.should_see_text('Add document link'))

        self.element_for_label('Enter URL').send_keys('aaa')
        self.button('SUBMIT').click()
        self.until(lambda: self.should_see_text('Invalid link! Please check URL'))

    def test_cancel_document_request(self):
        document = DocumentFactory(requested=True)
        self.go_to_documents()
        self.button('Cancel', ".document").click()
        self.button('OK').click()
        self.until(self.ajax_complete)

        Document.objects.get(id=document.id).requested.should.be.false

    def test_go_to_request_by_crid(self):
        document = DocumentFactory()
        self.go_to_documents()
        self.find('.crid-request-search').send_keys('%s\n' % document.allegation.crid)
        self.until(self.ajax_complete)
        self.should_see_text(document.allegation.crid)

    def test_go_to_request_by_crid_not_found(self):
        self.go_to_documents()
        self.find('.crid-request-search').send_keys('%s\n' % 123456)
        self.until(self.ajax_complete)
        self.until(lambda: self.should_see_text('CRID not found'))

    def test_get_document_request_analysis(self):
        DocumentFactory(requested=False, documentcloud_id=0)  # Missing
        DocumentFactory(pending=False, requested=True, documentcloud_id=0)  # Requested
        DocumentFactory(documentcloud_id=1)  # Fulfilled
        DocumentFactory(pending=True, requested=True)  # Pending

        self.go_to_documents()
        self.until_ajax_complete()
        for tab in ['missing', 'requested', 'fulfilled', 'pending']:
            tab_selector = '.tab-{tab_name} .analysis'.format(tab_name=tab)
            self.find(tab_selector).text.should.contain('1')
        self.find('.tab-all .analysis').text.should.contain('4')

    def test_sort_document_request(self):
        no_request_document = DocumentFactory(number_of_request=0)
        one_request_document = DocumentFactory(number_of_request=1)

        self.go_to_documents()
        self.until_ajax_complete()

        documents = self.find_all('tbody tr')
        documents[0].text.should.contain(str(one_request_document.allegation.crid))
        documents[1].text.should.contain(str(no_request_document.allegation.crid))

        self.element_by_tagname_and_text('th', 'No. of requests').click()
        self.until_ajax_complete()
        documents = self.find_all('tbody tr')
        documents[0].text.should.contain(str(no_request_document.allegation.crid))
        documents[1].text.should.contain(str(one_request_document.allegation.crid))

    def test_display_last_successful_crawl(self):
        DocumentCrawler.objects.create(num_documents=100)
        DocumentCrawler.objects.create(num_documents=155)
        self.go_to_documents()
        self.until_ajax_complete()

        self.should_see_text('Last successful crawl')
        self.until_ajax_complete()

        self.find('.last-successful-crawl-date').text.should.contain('155')

        self.find('.show-crawl-log').click()
        self.find('.document-crawl-log').text.should.contain('100')
