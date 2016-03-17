from django.core import management

from allegation.factories import AllegationFactory
from common.tests.core import SimpleTestCase


class UpdateDocumentsCommandTestCase(SimpleTestCase):
    def test_link_document_cloud(self):
        # mock documentcloud service later
        allegation = AllegationFactory(crid=1047194)

        management.call_command('update_documents')

        document = allegation.documents.get(type='CR')
        document.documentcloud_id.should.equal(2630898)

    def test_link_fail_document_cloud(self):
        # mock documentcloud service later
        allegation = AllegationFactory(crid='8769868975765')

        management.call_command('update_documents')

        document = allegation.documents.get(type='CR')
        document.documentcloud_id.should.equal(None)
