from unittest.mock import patch, Mock
from datetime import datetime

from django.core.urlresolvers import reverse

from allegation.factories import AllegationFactory
from common.models import Allegation
from common.tests.core import SimpleTestCase
from dashboard.admin import AllegationResource


class AdminInvestigationDocumentsExportViewTestCase(SimpleTestCase):
    def setUp(self):
        self.login_user()
        Allegation.objects.all().delete()
        self.allegation = AllegationFactory()

    @patch('dashboard.views.admin_investigation_documents_export_view.AllegationResource.export')
    def test_export_excel(self, mock_allegation_resource_export):
        file = 'file'
        mock_export = Mock(xls=file)
        today = datetime.now().strftime('%Y-%m-%d')

        mock_allegation_resource_export.return_value = mock_export

        response = self.client.get(reverse('documents-export'))
        response.content.decode('utf-8').should.equal(file)
        str(response.items()).should.contain(today)
