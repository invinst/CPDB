from mock import patch, MagicMock, call

from allegation.factories import DownloadFactory
from allegation.services.download_allegations import AllegationsDownload
from api.models import Setting
from common.tests.core import SimpleTestCase
from share.factories import SettingFactory


class AllegationsDownloadTestCase(SimpleTestCase):
    @patch('allegation.services.download_allegations.xlsxwriter.Workbook')
    def test_write_disclaimer(self, mock_workbook):
        setting = Setting.objects.first() or SettingFactory()
        download = DownloadFactory()

        line_1 = 'line_1'
        line_2 = 'line_2'
        setting.export_excel_disclaimer = '{line_1}\n{line_2}'.format(line_1=line_1, line_2=line_2)
        setting.save()

        mock_worksheet = MagicMock()
        mock_workbook().add_worksheet.return_value = mock_worksheet

        with patch('allegation.services.download_allegations.os'):
            allegation_download = AllegationsDownload(download.id)
            allegation_download.init_workbook()
            allegation_download.write_disclaimer()

            expected_calls = [
                call.write('A1', line_1),
                call.write('A2', line_2)
            ]

            mock_worksheet.assert_has_calls(expected_calls)
