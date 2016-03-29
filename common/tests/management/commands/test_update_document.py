from django.core import management
from mock import patch, Mock, call

from allegation.factories import AllegationFactory
from common.tests.core import SimpleTestCase


class UpdateDocumentsCommandTestCase(SimpleTestCase):
    def create_dummy_result(self, title='', published_url=''):
        mock_result = Mock()
        mock_result.configure_mock(title=title, published_url=published_url)

        return mock_result

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

    def test_clean_duplicate_document_title(self):
        result_1 = self.create_dummy_result(title='title', published_url='url1')
        result_2 = self.create_dummy_result(title='title', published_url='url2')
        expected_calls = [call(result_1, 'CR'), call(result_1, 'CPB')]

        with patch('common.management.commands.update_documents.DocumentCloud') as mock_documentcloud:
            mock_search = mock_documentcloud().documents.search
            mock_search.return_value = [result_1, result_2]
            with patch('common.management.commands.update_documents.Command.process_documentcloud_result')\
                    as mock_process:
                management.call_command('update_documents')

                mock_process.call_args_list.should.equal(expected_calls)
