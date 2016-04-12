from mock import patch, MagicMock, call

from allegation.factories import (
    DownloadFactory, OfficerAllegationFactory, AllegationFactory, ComplainingWitnessFactory, OfficerFactory)
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

    @patch('allegation.services.download_allegations.xlsxwriter.Workbook')
    def test_investigator_name_rank_in_allegation_sheet(self, mock_workbook):
        officer_allegation_1 = OfficerAllegationFactory()
        investigator = officer_allegation_1.allegation.investigator
        allegation_download = AllegationsDownload(DownloadFactory().id)
        allegation_download.officer_allegations = [officer_allegation_1]
        allegation_download.update_crids()
        allegation_download.write_headers = MagicMock()
        mock_worksheet = MagicMock()

        with patch('allegation.services.download_allegations.os'):
            allegation_download.init_workbook()

            allegation_download.write_allegations_columns(mock_worksheet)
            (sheet, columns), _ = allegation_download.write_headers.call_args
            sheet.should.equal(mock_worksheet)
            (set(columns) > set(['InvestigatorName', 'InvestigatorRank'])).should.be.true

            allegation_download.write_allegations_data(mock_worksheet)
            mock_worksheet.write.assert_any_call(1, 21, officer_allegation_1.allegation.investigator.name)
            mock_worksheet.write.assert_any_call(1, 22, investigator.current_rank)

    @patch('allegation.services.download_allegations.xlsxwriter.Workbook')
    def test_complaining_witness_sheet(self, mock_workbook):
        allegation = AllegationFactory()
        witness = ComplainingWitnessFactory(allegation=allegation, crid=allegation.crid)
        officer_allegation = OfficerAllegationFactory(allegation=allegation)
        allegation_download = AllegationsDownload(DownloadFactory().id)
        allegation_download.officer_allegations = [officer_allegation]
        allegation_download.update_crids()
        allegation_download.write_headers = MagicMock()

        with patch('allegation.services.download_allegations.os'):
            allegation_download.init_workbook()
            mock_worksheet = MagicMock()
            allegation_download.workbook.add_worksheet = MagicMock(return_value=mock_worksheet)

            allegation_download.write_complaint_witnesses()
            (sheet, columns), _ = allegation_download.write_headers.call_args
            sheet.should.equal(mock_worksheet)
            columns.should.equal(['CRID', 'Gender', 'Race', 'Age'])

            mock_worksheet.write.assert_any_call(1, 0, str(allegation.crid))
            mock_worksheet.write.assert_any_call(1, 1, witness.gender)
            mock_worksheet.write.assert_any_call(1, 2, witness.race)
            mock_worksheet.write.assert_any_call(1, 3, witness.age)

    @patch('allegation.services.download_allegations.xlsxwriter.Workbook')
    def test_officer_sheet(self, mock_workbook):
        allegation = AllegationFactory()
        officer = OfficerFactory()
        officer_allegation = OfficerAllegationFactory(allegation=allegation, officer=officer)
        allegation_download = AllegationsDownload(DownloadFactory().id)
        allegation_download.officer_allegations = [officer_allegation]
        allegation_download.update_crids()
        allegation_download.write_headers = MagicMock()

        with patch('allegation.services.download_allegations.os'):
            allegation_download.init_workbook()
            mock_worksheet = MagicMock()
            allegation_download.workbook.add_worksheet = MagicMock(return_value=mock_worksheet)

            allegation_download.write_officer_profile()
            (sheet, columns), _ = allegation_download.write_headers.call_args
            sheet.should.equal(mock_worksheet)
            columns.should.equal([
                'OfficerID', 'OfficerFirst', 'OfficerLast', 'Gender', 'Race',
                'ApptDate', 'Unit', 'Rank', 'Star', 'Age'])

            mock_worksheet.write.assert_any_call(1, 0, officer.id)
            mock_worksheet.write.assert_any_call(1, 1, officer.officer_first)
            mock_worksheet.write.assert_any_call(1, 2, officer.officer_last)
            mock_worksheet.write.assert_any_call(1, 3, officer.gender)
            mock_worksheet.write.assert_any_call(1, 4, officer.race)
            mock_worksheet.write.assert_any_call(1, 5, officer.appt_date)
            mock_worksheet.write.assert_any_call(1, 6, officer.unit)
            mock_worksheet.write.assert_any_call(1, 7, officer.rank)
            mock_worksheet.write.assert_any_call(1, 8, officer.star)
            mock_worksheet.write.assert_any_call(1, 9, officer.age)
