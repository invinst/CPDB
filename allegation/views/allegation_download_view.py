import datetime
import os
from uuid import uuid4

import xlsxwriter
from django.http.response import FileResponse

from allegation.views.allegation_api_view import AllegationAPIView
from common.models import PoliceWitness, ComplainingWitness, Officer


class AllegationDownloadView(AllegationAPIView):
    def __init__(self, **kwargs):
        super(AllegationDownloadView, self).__init__(**kwargs)
        self.workbook = None
        self.filename = ""
        self.header_format = None
        self.allegations = []
        self.crids = []

    def init_workbook(self):
        today = datetime.datetime.now().strftime("%Y-%m-%d")
        today_folder = "/tmp/%s" % today
        if not os.path.exists(today_folder):
            os.makedirs(today_folder)
        self.filename = os.path.join(today_folder, '%s.xlsx' % uuid4())
        self.workbook = xlsxwriter.Workbook(self.filename)
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

This dataset is compiled from three lists of complaints against Chicago Police Department officers,
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
        columns = """RecordID
CRID
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
            sheet.write(row_count, 0, allegation.id)
            sheet.write(row_count, 1, allegation.crid)

            if allegation.officer:
                sheet.write(row_count, 2, allegation.officer.id)
                sheet.write(row_count, 3, allegation.officer.officer_first)
                sheet.write(row_count, 4, allegation.officer.officer_last)

            if allegation.cat:
                sheet.write(row_count, 5, allegation.cat.cat_id)
                sheet.write(row_count, 6, allegation.cat.category)
                sheet.write(row_count, 7, allegation.cat.allegation_name)

            sheet.write(row_count, 8, allegation.recc_finding)
            sheet.write(row_count, 9, allegation.recc_outcome)
            sheet.write(row_count, 10, allegation.final_finding)
            sheet.write(row_count, 11, allegation.final_outcome)
            sheet.write(row_count, 12, "###")
            sheet.write(row_count, 13, "###")

            if allegation.beat:
                sheet.write(row_count, 14, allegation.beat.name)

            sheet.write(row_count, 15, allegation.location)
            sheet.write(row_count, 16, allegation.add1)
            sheet.write(row_count, 17, allegation.add2)
            sheet.write(row_count, 18, allegation.city)
            sheet.write(row_count, 19, allegation.incident_date.strftime("%Y-%m-%d %H:%M:%s"))
            sheet.write(row_count, 20, allegation.start_date)
            sheet.write(row_count, 21, allegation.end_date)
            sheet.write(row_count, 22, allegation.investigator_name)

            row_count += 1

    def write_allegations(self):
        sheet = self.workbook.add_worksheet()
        sheet.name = 'Allegations'
        sheet.set_tab_color('#a8c06e')

        self.write_allegations_columns(sheet)
        self.write_allegations_data(sheet)

    def write_police_witnesses(self):
        witnesses = PoliceWitness.objects.filter(crid__in=self.crids).order_by('crid')
        headers = "PWitID,CRID,OfficerID,Gender,Race"
        sheet = self.workbook.add_worksheet()
        sheet.name = "Police Witnesses"
        sheet.set_tab_color('#a8c06e')

        self.write_headers(sheet, headers.split(","))

        row_count = 1
        for witness in witnesses:
            sheet.write(row_count, 0, witness.pwit_id)
            sheet.write(row_count, 1, witness.crid)
            sheet.write(row_count, 2, witness.officer_id)
            sheet.write(row_count, 3, witness.gender)
            sheet.write(row_count, 4, witness.race)
            row_count += 1

    def write_complaint_witnesses(self):
        headers = "CWitID,CRID,Gender,Race"
        sheet = self.workbook.add_worksheet()
        sheet.name = "Complaining Witnesses"
        sheet.set_tab_color('#a8c06e')

        self.write_headers(sheet, headers.split(","))

        witnesses = ComplainingWitness.objects.filter(crid__in=self.crids).order_by('crid')

        row_count = 1
        for witness in witnesses:
            sheet.write(row_count, 0, witness.cwit_id)
            sheet.write(row_count, 1, witness.crid)
            sheet.write(row_count, 2, witness.gender)
            sheet.write(row_count, 3, witness.race)
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

    def write_sheet_data(self, name, data):
        sheet = self.workbook.add_worksheet()
        sheet.name = name
        sheet.set_tab_color("#295c8b")

        lines = data.splitlines()
        headers = lines[0]

        self.write_headers(sheet, headers.split("\t"))

        line_count = len(lines)
        row_count = 1
        for i in range(1, line_count):
            line = lines[i]
            cols = line.split("\t")
            count_count = 0
            for col in cols:
                sheet.write(row_count, count_count, col)
                count_count += 1
            row_count += 1

    def write_categories(self):
        data = """CatID	Category	Allegation
01A	Verbal Abuse	Use Of Profanity
01B	Verbal Abuse	Racial/Ethnic, Etc.
01C	Verbal Abuse	Miscellaneous
02A	Alcohol Abuse	Intoxicated On Duty
02B	Alcohol Abuse	Intoxicated Off Duty
02D	Alcohol Abuse	D.U.I. - Off Duty
02E	Alcohol Abuse	Possession/Drinking Alcohol - On Duty
02G	Alcohol Abuse	Miscellaneous
03A	First Amendment and Illegal Arrest	First Amendment
03B	First Amendment and Illegal Arrest	Search Of Person Without Warrant
03C	First Amendment and Illegal Arrest	Search Of Premise/Vehicle Without Warrant
03D	First Amendment and Illegal Arrest	Illegal Arrest
03E	First Amendment and Illegal Arrest	Injury/Death (Under Color Of Law)
03F	First Amendment and Illegal Arrest	Failure To Insure
03G	First Amendment and Illegal Arrest	Miscellaneous
04A	Search-Related	Bonding/Booking/Processing
04B	Search-Related	Arrest/Improper
04C	Search-Related	Excessive Detention
04D	Search-Related	Search, Person/Property
04E	Search-Related	Prisoner'S Property - Inventory/Receipt
04F	Search-Related	Escape
04G	Search-Related	Telephone - Attorney/Relative Privileges
04H	Search-Related	Proper Care, Injury/Death
04J	Search-Related	Miscellaneous
05A	Arrest/Lock-up Procedures	Arrestee - During Arrest
05B	Arrest/Lock-up Procedures	Arrestee - After Arrest, Prior To Lockup
05C	Arrest/Lock-up Procedures	Arrestee - Lockup/Detention
05D	Arrest/Lock-up Procedures	No Arrest
05E	Arrest/Lock-up Procedures	Traffic
05F	Arrest/Lock-up Procedures	Domestic
05G	Arrest/Lock-up Procedures	Weapon, Use/Display Of
05H	Arrest/Lock-up Procedures	Miscellaneous
05J	Arrest/Lock-up Procedures	"U" Converted To C.R. (Records Keeping Only, Initial)
05K	Arrest/Lock-up Procedures	Domestic Altercation/Incident - Off Duty
05L	Arrest/Lock-up Procedures	Unnecessary Physical Contact - On Duty
05M	Arrest/Lock-up Procedures	Unnecessary Physical Contact - Off Duty
05N	Arrest/Lock-up Procedures	Weapon - Unnecessary Display Of
05P	Arrest/Lock-up Procedures	Excessive Force - Off Duty (Includes Neighbor, Traffic)
05Q	Arrest/Lock-up Procedures	Civil Suit - Third Party
05T	Arrest/Lock-up Procedures	Excessive Force - Taser - Use Of
06A	Bribery / Official Corruption	Solicit/Accept Bribe (Non - Traffic)
06B	Bribery / Official Corruption	Solicit/Accept Bribe (Traffic)
06C	Bribery / Official Corruption	Extortion
06E	Bribery / Official Corruption	Gratuity
06F	Bribery / Official Corruption	Recommend Professional Service
06G	Bribery / Official Corruption	Use Official Position
06H	Bribery / Official Corruption	An Act To Circumvent Criminal Prosecution
06J	Bribery / Official Corruption	Miscellaneous
07A	Traffic	Misconduct During Issuance Of Citation
07B	Traffic	Improper Processing/Reporting/Procedures
07C	Traffic	Violation (Other Than D.U.I.) - On Duty
07D	Traffic	Parking Complaints
07E	Traffic	Fail To Enforce Traffic Regulations
07F	Traffic	Miscellaneous
07T	Traffic	Preventable Traffic Accident
08B	Criminal Misconduct	Assault/Battery, Etc.
08C	Criminal Misconduct	Rape/Sex Offenses
08F	Criminal Misconduct	Theft
08G	Criminal Misconduct	Shoplifting
08H	Criminal Misconduct	Robbery
08J	Criminal Misconduct	Drugs/Contr. Sub., Possession Or Sale
08K	Criminal Misconduct	Damage/Trespassing Property
08M	Criminal Misconduct	Other Felony
08N	Criminal Misconduct	Miscellaneous
09A	Conduct Unbecoming (Off-duty)	Altercation/Disturbance - Domestic
09B	Conduct Unbecoming (Off-duty)	Altercation/Disturbance - Neighbor
09C	Conduct Unbecoming (Off-duty)	Altercation/Disturbance - Traffic
09D	Conduct Unbecoming (Off-duty)	Traffic Violation (Other Than D.U.I.)
09E	Conduct Unbecoming (Off-duty)	Misdemeanor Arrest
09F	Conduct Unbecoming (Off-duty)	Sexual Misconduct
09G	Conduct Unbecoming (Off-duty)	Abuse Of Authority
09H	Conduct Unbecoming (Off-duty)	Judicial Process/Directive - Contempt
09J	Conduct Unbecoming (Off-duty)	Miscellaneous
09K	Conduct Unbecoming (Off-duty)	Indebtedness To City
09L	Conduct Unbecoming (Off-duty)	Driver'S License Revoked/Suspended
10A	Operation/Personnel Violations	Absent Without Permission
10B	Operation/Personnel Violations	Medical Roll
10C	Operation/Personnel Violations	Compensatory Time
10D	Operation/Personnel Violations	Communication Operations Procedures
10E	Operation/Personnel Violations	Secondary/Special Employment
10F	Operation/Personnel Violations	Court Irregularities
10H	Operation/Personnel Violations	Leaving Assignment (District, Beat, Sector, Court)
10J	Operation/Personnel Violations	Neglect Of Duty/Conduct Unbecoming - On Duty
10K	Operation/Personnel Violations	Late - Roll Call/Assignment/Court
10L	Operation/Personnel Violations	Weapon/Ammunition/Uniform Deviation
10M	Operation/Personnel Violations	Insubordination
10N	Operation/Personnel Violations	Lunch/Personal Violations
10P	Operation/Personnel Violations	Misuse Of Department Equipment/Supplies
10Q	Operation/Personnel Violations	Misuse Department Records
10R	Operation/Personnel Violations	Residency
10S	Operation/Personnel Violations	Sexual Harrassment
10T	Operation/Personnel Violations	Reports - Failed To Submit/Improper
10U	Operation/Personnel Violations	Inadequate/Failure To Provide Service
10V	Operation/Personnel Violations	Inventory Procedures
10W	Operation/Personnel Violations	Vehicle Licensing - City
10X	Operation/Personnel Violations	Vehicle Licensing - State
10Z	Operation/Personnel Violations	Miscellaneous
12A	Supervisory Responsibilities	Proper Action, Initiate
12B	Supervisory Responsibilities	Proper Direction - Subordinate
12C	Supervisory Responsibilities	Proper Action Review/Inspect - Subordinate
12D	Supervisory Responsibilities	Fail To Obtain A Complaint Register Number
12E	Supervisory Responsibilities	Improper/Inadequate Investigation
12F	Supervisory Responsibilities	Miscellaneous
14A	Supervisory Responsibilities	State Civil Suit
14B	Supervisory Responsibilities	Federal Civil Suit
15A	Drug/Substance Abuse	Use/Abuse Drugs/Contr. Substance - On Duty
15B	Drug/Substance Abuse	Use/Abuse Drugs/Contr. Substance - Off Duty
15C	Drug/Substance Abuse	D.U.I., Drugs/ Contr. Sub. - On Duty
15D	Drug/Substance Abuse	D.U.I., Drugs/ Contr. Sub. - Off Duty
15H	Drug/Substance Abuse	Positive Drug Screen - Other Physical Exam
15K	Drug/Substance Abuse	Miscellaneous"""
        self.write_sheet_data("Categories", data)

    def write_finding(self):
        data = """Finding	Finding	Result
DS	Discharged	Unsustained
EX	Exonerated	Unsustained
NA	No Affidavit	Unsustained
NC	No Cooperation	Unsustained
NS	Not Sustained	Unsustained
SU	Sustained	Sustained
UN	Unfounded	Unsustained"""
        self.write_sheet_data("Findings", data)

    def write_outcome(self):
        data = """Outcome	Outcome
000	Noted
001	1
002	2
003	3
004	4
005	5
006	6
007	7
008	8
010	10
012	12
015	15
016	16
020	20
021	21
022	22
023	23
025	25
028	28
030	30
045	45
060	60
090	90
100	Reprimand
120	120
180	180
200	Over 30
300	Administrative Termination
400	Separation
500	Reinstated - Board
600	Unsustained
700	Reinstated - Court
800	Resigned
900	Not Served"""
        self.write_sheet_data("Outcomes", data)

    def get(self, request):
        self.allegations = self.get_allegations()
        self.crids = [o.crid for o in self.allegations]

        self.init_workbook()
        self.write_disclaimer()
        self.write_allegations()
        self.write_police_witnesses()
        self.write_complaint_witnesses()
        self.write_officer_profile()
        self.write_categories()
        self.write_finding()
        self.write_outcome()
        self.save_workbook()

        response = FileResponse(open(self.filename, "rb"),
                                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename="allegation.xlsx"'
        return response
