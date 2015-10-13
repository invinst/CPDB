from allegation.factories import AllegationFactory
from common.models import Allegation
from common.tests.core import BaseLiveTestCase


class DocumentRequestTestCase(BaseLiveTestCase):
    def setUp(self):
        self.login_user()
        self.visit('/admin/')

    def tearDown(self):
        super(DocumentRequestTestCase, self).tearDown()
        Allegation.objects.all().delete()

    def go_to_documents(self):
        self.element_by_tagname_and_text('span', 'Investigation Documents').click()

    def go_to_tab(self, text):
        self.element_by_tagname_and_text('li', text).click()
        self.until_ajax_complete()

    def tab_should_active(self, text):
        self.element_by_tagname_and_text('li', text).has_class('active').should.be.true

    def test_see_document_request_tab(self):
        self.should_see_text('Investigation Documents')
        self.go_to_documents()
        self.find("h1").text.should.equal('Investigation Documents')
        self.button("Add document").should.be.ok

        tabs = ["All", "Missing", "Requesting", "Fulfilled", "Pending"]
        for tab in tabs:
            self.should_see_text(tab)

        self.tab_should_active("All")

        for tab in tabs:
            self.element_by_tagname_and_text('li', tab).click()
            self.tab_should_active(tab)

    def test_filter_pending_documents(self):
        allegation = AllegationFactory(document_requested=True, document_pending=True)

        self.go_to_documents()
        self.go_to_tab('Pending')

        self.should_see_text(allegation.crid)

    def test_change_requesting_to_pending(self):
        allegation = AllegationFactory(document_requested=True)

        self.go_to_documents()
        self.go_to_tab('Requesting')
        self.button('Requested').click()

        self.until(lambda: self.should_see_text('%s document has been requested.' % allegation.crid))

        self.go_to_tab('Pending')
        self.should_see_text(allegation.crid)
        buttons = [x.text for x in self.find_all("button")]
        buttons.shouldnt.contain("Pending")

    def test_add_document_link(self):
        AllegationFactory()

        self.go_to_documents()
        self.button("Add document").click()
        self.until(lambda: self.should_see_text('Add document link'))

        self.element_for_label('Enter URL').send_keys('https://www.documentcloud.org/documents/1273509-cr-1002643.html')
        self.button('SUBMIT').click()
        self.until(lambda: self.should_see_text('The document is successfully added to allegation #1002643!'))

    def test_error_adding_link(self):
        AllegationFactory()

        self.go_to_documents()
        self.button("Add document").click()
        self.until(lambda: self.should_see_text('Add document link'))

        self.element_for_label('Enter URL').send_keys('aaa')
        self.button('SUBMIT').click()
        self.until(lambda: self.should_see_text('Invalid link! Please check URL'))

    def test_cancel_document_request(self):
        allegation = AllegationFactory(document_requested=True)
        self.go_to_documents()
        self.button('Cancel', ".document").click()
        self.button('OK').click()
        self.until(self.ajax_complete)

        Allegation.objects.get(id=allegation.id).document_requested.should.be.false

    def test_go_to_request_by_crid(self):
        allegation = AllegationFactory()
        self.go_to_documents()
        self.find('.crid-request-search').send_keys('%s\n' % allegation.crid)
        self.until(self.ajax_complete)
        self.should_see_text(allegation.crid)

    def test_go_to_request_by_crid_not_found(self):
        self.go_to_documents()
        self.find('.crid-request-search').send_keys('%s\n' % 123456)
        self.until(self.ajax_complete)
        self.until(lambda: self.should_see_text('CRID not found'))
