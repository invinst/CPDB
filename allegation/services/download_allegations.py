import datetime
import os
from uuid import uuid4
from django.conf import settings
from django.http.request import QueryDict

import xlsxwriter
from allegation.models import Download

from allegation.views.allegation_api_view import AllegationAPIView
from common.models import PoliceWitness, ComplainingWitness, Officer, FINDINGS, OUTCOMES
from cpdb.celery import app

FINDINGS_DICT = dict(FINDINGS)
OUTCOME_DICT = dict(OUTCOMES)


class AllegationsDownload(AllegationAPIView):
    def __init__(self, download_id, **kwargs):
        super(AllegationsDownload, self).__init__(**kwargs)
        self.download = Download.objects.get(pk=download_id)
        self.workbook = None
        self.filename = ""
        self.filepath = ""
        self.header_format = None
        self.allegations = []
        self.crids = []

    def init_workbook(self):
        today = datetime.datetime.now().strftime("%Y-%m-%d")
        today_folder = os.path.join(settings.MEDIA_ROOT, today)
        if not os.path.exists(today_folder):
            os.makedirs(today_folder)
        random = str(uuid4())
        file_folder = os.path.join(today_folder, random)
        if not os.path.exists(file_folder):
            os.makedirs(file_folder)
        self.filename = os.path.join(today, random, 'allegation.xlsx')
        self.filepath = os.path.join(settings.MEDIA_ROOT, self.filename)
        self.workbook = xlsxwriter.Workbook(self.filepath)
        self.header_format = self.workbook.add_format({
            'bg_color': 'gray',
        })

    def save_workbook(self):
        self.workbook.close()

    def write_disclaimer(self):
        worksheet = self.workbook.add_worksheet()

        worksheet.name = "DISCLAIMER"
        worksheet.set_column('A:A', 100)
        worksheet.set_tab_color('red')

        DISCLAIMER = """DISCLAIMER:

This dataset is compiled from three lists of allegations against Chicago Police Department officers,
spanning approximately 2002 - 2008 and 2010 - 2014, produced by the City of Chicago in response
to litigation and to FOIA requests.

The City of Chicago's production of this information is accompanied by a disclaimer that
not all information contained in the City's database may be correct.

No independent verification of the City's records has taken place and this dataset does not
purport to be an accurate reflection of either the City's database or its veracity."""

        line_count = 0
        for line in DISCLAIMER.splitlines():
            line_count += 1
            worksheet.write("A%s" % line_count, line)

    def write_headers(self, sheet, headers):
        col_count = 0
        for header in headers:
            sheet.write(0, col_count, header, self.header_format)
            col_count += 1

    def write_allegations_columns(self, sheet):
        columns = """CRID
OfficerID
OfficeFirst
OfficerLast
AllegationCode
Category
Allegation
RecommendedFinding
RecommendedOutcome
FinalFinding
FinalOutcome
Finding
Outcome
Beat
Location
Add1
Add2
City
IncidentDate
StartDate
EndDate
Investigator"""
        self.write_headers(sheet, columns.splitlines())

    def write_allegations_data(self, sheet):
        row_count = 1
        for allegation in self.allegations:
            sheet.write(row_count, 0, allegation.crid)

            if allegation.officer:
                sheet.write(row_count, 1, allegation.officer.id)
                sheet.write(row_count, 2, allegation.officer.officer_first)
                sheet.write(row_count, 3, allegation.officer.officer_last)

            if allegation.cat:
                sheet.write(row_count, 4, allegation.cat.cat_id)
                sheet.write(row_count, 5, allegation.cat.category)
                sheet.write(row_count, 6, allegation.cat.allegation_name)

            sheet.write(row_count, 7, allegation.recc_finding)
            sheet.write(row_count, 8, allegation.recc_outcome)
            sheet.write(row_count, 9, allegation.final_finding)
            sheet.write(row_count, 10, allegation.final_outcome)
            sheet.write(row_count, 11, FINDINGS_DICT.get(allegation.final_finding))
            sheet.write(row_count, 12, OUTCOME_DICT.get(allegation.final_outcome))

            if allegation.beat:
                sheet.write(row_count, 13, allegation.beat.name)

            sheet.write(row_count, 14, allegation.location)
            sheet.write(row_count, 15, allegation.add1)
            sheet.write(row_count, 16, allegation.add2)
            sheet.write(row_count, 17, allegation.city)
            if allegation.incident_date and allegation.incident_date.year > 1970:
                sheet.write(row_count, 18, allegation.incident_date.strftime("%Y-%m-%d %H:%M:%S"))
            if allegation.start_date:
                sheet.write(row_count, 19, allegation.start_date.strftime("%Y-%m-%d"))
            if allegation.end_date:
                sheet.write(row_count, 20, allegation.end_date.strftime("%Y-%m-%d"))
            sheet.write(row_count, 21, allegation.investigator_name)

            row_count += 1

    def write_allegations(self):
        sheet = self.workbook.add_worksheet()
        sheet.name = 'Allegations'
        sheet.set_tab_color('#a8c06e')

        self.write_allegations_columns(sheet)
        self.write_allegations_data(sheet)

    def write_police_witnesses(self):
        witnesses = PoliceWitness.objects.filter(crid__in=self.crids).order_by('crid')
        headers = "CRID,OfficerID,Gender,Race"
        sheet = self.workbook.add_worksheet()
        sheet.name = "Police Witnesses"
        sheet.set_tab_color('#a8c06e')

        self.write_headers(sheet, headers.split(","))

        row_count = 1
        for witness in witnesses:
            sheet.write(row_count, 0, witness.crid)
            sheet.write(row_count, 1, witness.officer_id)
            sheet.write(row_count, 2, witness.gender)
            sheet.write(row_count, 3, witness.race)
            row_count += 1

    def write_complaint_witnesses(self):
        headers = "CRID,Gender,Race"
        sheet = self.workbook.add_worksheet()
        sheet.name = "Complaining Witnesses"
        sheet.set_tab_color('#a8c06e')

        self.write_headers(sheet, headers.split(","))

        witnesses = ComplainingWitness.objects.filter(crid__in=self.crids).order_by('crid')

        row_count = 1
        for witness in witnesses:
            sheet.write(row_count, 0, witness.crid)
            sheet.write(row_count, 1, witness.gender)
            sheet.write(row_count, 2, witness.race)
            row_count += 1

    def write_officer_profile(self):
        headers = "OfficerID,OfficerFirst,OfficerLast,Gender,Race,ApptDate,Unit,Rank,Star"
        sheet = self.workbook.add_worksheet()
        sheet.name = "Officer Profile"
        sheet.set_tab_color('#a8c06e')

        self.write_headers(sheet, headers.split(","))

        officer_ids = [o.officer_id for o in self.allegations]
        officers = Officer.objects.filter(id__in=officer_ids)

        row_count = 1
        for officer in officers:
            sheet.write(row_count, 0, officer.id)
            sheet.write(row_count, 1, officer.officer_first)
            sheet.write(row_count, 2, officer.officer_last)
            sheet.write(row_count, 3, officer.gender)
            sheet.write(row_count, 4, officer.race)
            sheet.write(row_count, 5, officer.appt_date)
            sheet.write(row_count, 6, officer.unit)
            sheet.write(row_count, 7, officer.rank)
            sheet.write(row_count, 8, officer.star)
            row_count += 1

    def save_model(self):
        self.download.finished = True
        self.download.url = self.filename
        self.download.save()

    @property
    def query_dict(self):
        return QueryDict(self.download.query)

    def generate(self):
        self.allegations = self.get_allegations()
        self.crids = [o.crid for o in self.allegations]

        self.init_workbook()
        self.write_disclaimer()
        self.write_allegations()
        self.write_police_witnesses()
        self.write_complaint_witnesses()
        self.write_officer_profile()
        self.save_workbook()

        self.save_model()


@app.task
def download_allegations(download_id):
    AllegationsDownload(download_id).generate()
