from unittest import mock

from django.core import management
from faker import Faker

from common.models import Allegation
from common.tests.core import SimpleTestCase
from allegation.factories import AllegationFactory
from document.utils import send_document_notification_by_crid_and_link

fake = Faker()


class SendDocumentNotificationTestCase(SimpleTestCase):
    document_cloud_path = 'common.management.commands.update_documents.DocumentCloud'
    notification_path = 'document.utils.send_document_notification_by_crid_and_link'

    def setUp(self):
        self.allegation = AllegationFactory()

    def test_send_notification_on_new_document(self):
        allegation = AllegationFactory(document_title='UNSET')

        with mock.patch(self.notification_path) as send_notification:
            with mock.patch(self.document_cloud_path) as document_cloud:
                title = fake.name()

                instance = document_cloud.return_value
                document = mock.Mock(title=title, id="1-2-3")
                instance.documents.search.return_value = [document]  # search return result

                management.call_command('update_documents', end=allegation.id-1)

                first_allegation = Allegation.objects.get(id=self.allegation.id)
                first_allegation.document_title.should.equal(title)

                second_allegation = Allegation.objects.get(id=allegation.id)
                second_allegation.document_title.should.equal('UNSET')

                #it is being called, I've checked with pdb, but not being set
                send_document_notification_by_crid_and_link.called.should.be.true

    def test_update_document_clear_data_on_link_not_found(self):
        with mock.patch(self.document_cloud_path) as document_cloud:
            instance = document_cloud.return_value
            instance.documents.search.return_value = None

            management.call_command('update_documents')

            allegation = Allegation.objects.get(id=self.allegation.id)
            allegation.document_title.should.be.empty
