from django.core import management

from allegation.factories import AllegationFactory
from common.models import Allegation
from common.tests.core import SimpleTestCase


class TestOfficerProfileLink(SimpleTestCase):
    def setUp(self):
        self.allegation = AllegationFactory(crid=1047194)
        self.not_exist_allegation = AllegationFactory(crid='8769868975765')

    def test_link_document_cloud(self):
        management.call_command('update_documents')

        allegation = Allegation.objects.get(pk=self.allegation.pk)
        allegation.document_id.should.equal(2630898)

    def test_link_fail_document_cloud(self):
        management.call_command('update_documents')

        allegation = Allegation.objects.get(pk=self.not_exist_allegation.pk)
        allegation.document_id.should.equal(None)
