from unittest import mock

from django.core import management
from faker import Faker

from common.tests.core import SimpleTestCase
from document.factories import DocumentFactory
from document.utils import send_document_notification

fake = Faker()


class SendDocumentNotificationTestCase(SimpleTestCase):
    document_cloud_path = 'common.management.commands.update_documents.DocumentCloud'
    notification_path = 'document.utils.send_document_notification'

    def test_send_notification_on_new_document(self):
        document = DocumentFactory()
        unset_document = DocumentFactory(title='UNSET')

        with mock.patch(self.notification_path):
            with mock.patch(self.document_cloud_path) as document_cloud:
                title = fake.name()

                instance = document_cloud.return_value
                document = mock.Mock(title=title, id='1-2-3')
                # search return result
                instance.documents.search.return_value = [document]

                management.call_command('update_documents', end=unset_document.id - 1)

                document.refresh_from_db()
                document.title.should.equal(title)

                unset_document.refresh_from_db()
                unset_document.title.should.equal('UNSET')

                # it is being called, I've checked with pdb, but not being set
                send_document_notification.called.should.be.true
