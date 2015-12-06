from unittest import mock

from common.tests.core import SimpleTestCase
from allegation.factories import AllegationFactory


class SendDocumentNotificationTestCase(SimpleTestCase):
    def test_send_notification_on_new_document(self):
        allegation = AllegationFactory()
        notification_path = 'document.utils.send_document_notification_by_crid_and_link'
        document_cloud_path = 'common.management.commands.update_documents.DocumentCloud'
        with mock.patch(notification_path) as send_notification:
            with mock.patch(document_cloud_path) as document_cloud:
                instance = document_cloud.return_value
                document = mock.Mock(title="title", id="1-2-3")
                instance.documents.search.return_value = [document]  # search return result

                management.call_command('update_documents')
                send_notification.called.should.be.true
