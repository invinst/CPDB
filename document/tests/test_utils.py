from unittest import mock

from django.core import management
from faker import Faker

from common.models import Allegation
from common.tests.core import SimpleTestCase
from allegation.factories import AllegationFactory


fake = Faker()


class SendDocumentNotificationTestCase(SimpleTestCase):
    document_cloud_path = 'common.management.commands.update_documents.DocumentCloud'

    def setUp(self):
        self.allegation = AllegationFactory(document_title='UNSET')

    def test_send_notification_on_new_document(self):
        notification_path = 'document.utils.send_document_notification_by_crid_and_link'
        with mock.patch(notification_path) as send_notification:
            with mock.patch(self.document_cloud_path) as document_cloud:
                title = fake.name()

                instance = document_cloud.return_value
                document = mock.Mock(title=title, id="1-2-3")
                instance.documents.search.return_value = [document]  # search return result

                management.call_command('update_documents')

                allegation = Allegation.objects.get(id=self.allegation.id)
                allegation.document_title.should.equal(title)

                send_notification.called.should.be.true

    def test_update_document_clear_data_on_link_not_found(self):
        with mock.patch(self.document_cloud_path) as document_cloud:
            instance = document_cloud.return_value
            instance.documents.search.return_value = None

            management.call_command('update_documents')

            allegation = Allegation.objects.get(id=self.allegation.id)
            allegation.document_title.should.be.empty
