from django.contrib.auth.models import AbstractUser
from django.contrib.gis.db import models
from django.core.urlresolvers import reverse
from django.template.defaultfilters import slugify

from allegation.models.allegation_manager import AllegationManager


class User(AbstractUser):
    pass

RANKS = [
    ['FTO', 'Field Training Officer'],
    ['LT', 'Lieutenant'],
    ['ET', 'Evidence Technician'],
    ['DET', 'Detective'],
    ['PO', 'Police Officer'],
    ['Cpt', 'Captain'],
    ['SGT', 'Sergeant'],
    ['CMDR', 'Commander'],
    ['Agent', 'Police Agent'],
    ['Chief', 'Chief']
]


class Officer(models.Model):
    officer_first = models.CharField(max_length=255, null=True, db_index=True, blank=True)
    officer_last = models.CharField(max_length=255, null=True, db_index=True, blank=True)
    gender = models.CharField(max_length=1, null=True, blank=True)
    race = models.CharField(max_length=50, null=True, blank=True)
    appt_date = models.DateField(null=True, blank=True)
    unit = models.CharField(max_length=5, null=True, blank=True)
    rank = models.CharField(max_length=5, null=True, blank=True)
    star = models.FloatField(null=True, blank=True)
    allegations_count = models.IntegerField(default=0, blank=True)
    discipline_count = models.IntegerField(default=0, blank=True)
    birth_year = models.IntegerField(default=0, blank=True)

    @property
    def absolute_url(self):
        return self.get_absolute_url()

    def get_absolute_url(self):
        return reverse("officer:detail") + "?pk=%d" % self.pk

    def __str__(self):
        return "{first} {last}".format(
            last=self.officer_last,
            first=self.officer_first
        )

    @property
    def tag_value(self):
        return {
            'text': str(self),
            'value': self.pk
        }


class OfficerHistory(models.Model):
    officer = models.ForeignKey(Officer, null=True)
    unit = models.CharField(max_length=5, null=True)
    rank = models.CharField(max_length=5, null=True)
    star = models.FloatField(null=True)
    as_of = models.DateField(null=True)


class PoliceWitness(models.Model):
    pwit_id = models.AutoField(primary_key=True)
    crid = models.CharField(max_length=30, null=True, db_index=True)
    gender = models.CharField(max_length=1, null=True)
    race = models.CharField(max_length=50, null=True)
    officer = models.ForeignKey(Officer, null=True)


class ComplainingWitness(models.Model):
    cwit_id = models.AutoField(primary_key=True)
    crid = models.CharField(max_length=30, null=True, db_index=True)
    gender = models.CharField(max_length=1, null=True)
    race = models.CharField(max_length=50, null=True)
    age = models.IntegerField(null=True)


class AllegationCategory(models.Model):
    cat_id = models.CharField(primary_key=True, max_length=255)
    category = models.CharField(max_length=255, null=True, db_index=True)
    allegation_name = models.CharField(max_length=255, null=True, db_index=True)
    allegation_count = models.IntegerField(default=0)
    category_count = models.IntegerField(default=0)

    def __str__(self):
        return str(self.allegation_name)

    @property
    def tag_value(self):
        return {
            'text': str(self),
            'value': self.pk
        }


class Area(models.Model):
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=30, choices=[['beat', 'Beat'], ['neighborhood', 'Neighborhood'],
                                                    ['school-grounds', 'School Grounds'], ['ward', 'Ward'],
                                                    ['police-districts', 'Police District']], db_index=True)
    polygon = models.MultiPolygonField(srid=4326, null=True, blank=True)
    objects = models.GeoManager()

OUTCOMES = [
    ['000', 'Violation Noted'],
    ['001', '1 Day Suspension'],
    ['002', '2 Day Suspension'],
    ['003', '3 Day Suspension'],
    ['004', '4 Day Suspension'],
    ['005', '5 Day Suspension'],
    ['006', '6 Day Suspension'],
    ['007', '7 Day Suspension'],
    ['008', '8 Day Suspension'],
    ['009', '9 Day Suspension'],
    ['010', '10 Day Suspension'],
    ['011', '11 Day Suspension'],
    ['012', '12 Day Suspension'],
    ['013', '13 Day Suspension'],
    ['014', '14 Day Suspension'],
    ['015', '15 Day Suspension'],
    ['016', '16 Day Suspension'],
    ['017', '17 Day Suspension'],
    ['018', '18 Day Suspension'],
    ['019', '19 Day Suspension'],
    ['020', '20 Day Suspension'],
    ['021', '21 Day Suspension'],
    ['022', '22 Day Suspension'],
    ['023', '23 Day Suspension'],
    ['024', '24 Day Suspension'],
    ['025', '25 Day Suspension'],
    ['026', '26 Day Suspension'],
    ['027', '27 Day Suspension'],
    ['028', '28 Day Suspension'],
    ['029', '29 Day Suspension'],
    ['030', '30 Day Suspension'],
    ['100', 'Reprimand'],
    ['200', 'Suspended over 30 Days'],
    ['300', 'Administrative Termination'],
    ['400', 'Separation'],
    ['500', 'Reinstated by Police Board'],
    ['600', 'No Action Taken'],
    ['700', 'Reinstated by Court Action'],
    ['800', 'Resigned'],
    ['900', 'Penalty Not Served'],
]

UNITS = [
    ['001', 'District 1 - Central'],
    ['012', 'District 12 - Near West'],
    ['002', 'District 2 - Wentworth'],
    ['014', 'District 14 - Shakespeare'],
    ['003', 'District 3 - Grand Crossing'],
    ['015', 'District 15 - Austin'],
    ['004', 'District 4 - South Chicago'],
    ['016', 'District 16 - Jefferson Park'],
    ['005', 'District 5 - Calumet'],
    ['017', 'District 17 - Albany Park'],
    ['006', 'District 6 - Gresham'],
    ['018', 'District 18 - Near North'],
    ['007', 'District 7 - Englewood'],
    ['019', 'District 19 - Town Hall'],
    ['008', 'District 8 - Chicago Lawn'],
    ['020', 'District 20 - Lincoln'],
    ['009', 'District 9 - Deering'],
    ['022', 'District 22 - Morgan Park'],
    ['010', 'District 10 - Ogden'],
    ['024', 'District 24 - Rogers Park'],
    ['011', 'District 11 - Harrison'],
    ['025', 'District 25 - Grand Central'],
    ['026', 'District Executive Officers Unit'],
    ['044', 'Recruit Training'],
    ['045', 'District Reinstatement'],
    ['050', 'Airport Law Enforcement Unit-North'],
    ['051', 'Airport Law Enforcement Unit-South'],
    ['055', 'Mounted Patrol Unit'],
    ['059', 'Marine Unit'],
    ['060', 'Helicopter Unit'],
    ['079', 'Special Investigations Section'],
    ['101', 'Police Board'],
    ['102', 'Office of News Affairs'],
    ['111', 'Office of the Superintendent'],
    ['113', 'Independent Police Review Authority (IPRA)'],
    ['114', 'Legal Affairs Section'],
    ['115', 'Office of Crime Control Strategies'],
    ['116', 'Deployment Operations Center'],
    ['118', 'Chaplains Section'],
    ['120', 'Bureau of Administration'],
    ['121', 'Bureau of Internal Affairs'],
    ['122', 'Finance Division'],
    ['123', 'Human Resources Division'],
    ['124', 'Education and Training Division'],
    ['125', 'Public Safety Information Technology (PSIT)'],
    ['126', 'Inspection Division'],
    ['127', 'Research and Development Division'],
    ['128', 'Professional Counseling Division'],
    ['129', 'Management and Labor Affairs Section'],
    ['130', 'Bureau of Organizational Development'],
    ['133', 'Information and Strategic Services'],
    ['134', 'Field Technology Training Unit'],
    ['135', 'Chicago Alternative Policing Strategy (CAPS) Division'],
    ['136', 'Special Events Unit'],
    ['140', 'Office of the First Deputy Superintendent'],
    ['141', 'Special Functions Division'],
    ['142', 'Bureau of Patrol'],
    ['145', 'Traffic Section'],
    ['148', 'Traffic Court Unit'],
    ['154', 'Traffic Safety and Training'],
    ['161', 'General Support Division'],
    ['162', 'Records Division'],
    ['163', 'Records Inquiry Section'],
    ['166', 'Field Services Section'],
    ['167', 'Evidence and Recovered Property Section'],
    ['168', 'Auto Pounds Section'],
    ['169', 'Police Documents Section'],
    ['171', 'Central Detention'],
    ['172', 'Equipment and Supply Section'],
    ['173', 'Fleet Liaison Section'],
    ['175', 'Telecommunications Unit'],
    ['176', 'Communication Operations Unit'],
    ['177', 'Forensics Services Division'],
    ['178', 'Property Facility Management Unit'],
    ['179', 'Reproduction and Graphic Arts Section'],
    ['180', 'Bureau of Detectives'],
    ['184', 'Youth Investigation Section'],
    ['188', 'Bureau of Organized Crime'],
    ['189', 'Narcotics Division'],
    ['191', 'Intelligence Section'],
    ['192', 'Vice and Asset Forfeiture Division'],
    ['193', 'Gang Investigation Division'],
    ['196', 'Asset Forfeiture Investigations Section'],
    ['211', 'Bureau of Patrol - Area Central'],
    ['212', 'Bureau of Patrol - Area South'],
    ['213', 'Bureau of Patrol - Area North'],
    ['214', 'Office of Freedom of Information'],
    ['222', 'Timekeeping Unit - Headquarters'],
    ['231', 'Medical Services Section'],
    ['241', 'Troubled Buildings Section'],
    ['242', 'Fleet Management Detail Unit'],
    ['261', 'Court Section'],
    ['276', 'OEMC-Detail Section'],
    ['277', 'Forensic Services - Evidence Technician Section'],
    ['311', 'Gang Enforcement - Area Central'],
    ['312', 'Gang Enforcement - Area South'],
    ['313', 'Gang Enforcement - Area North'],
    ['341', 'Canine Unit'],
    ['353', 'Special Weapons and Tactics (SWAT) Unit'],
    ['376', 'Alternate Response Section'],
    ['384', 'Juvenile Intervention Support Center (JISC)'],
    ['393', 'Gang Enforcement Division'],
    ['441', 'Special Activities Section'],
    ['442', 'Bomb Unit'],
    ['443', "Bomb Unit - O'Hare Airport'"],
    ['541', 'FOP Detail'],
    ['542', 'Detached Services - Governmental Security Detail'],
    ['543', 'Detached Services-Miscellaneous Detail'],
    ['545', 'PBPA Sergeant'],
    ['547', 'Chicago Police Memorial Foundation'],
    ['549', 'Inspector General Detail Unit'],
    ['603', 'Arson Section'],
    ['606', 'Central Investigations Division'],
    ['608', 'Major Accident Investigation Unit'],
    ['610', 'Bureau of Detectives - Area Central'],
    ['620', 'Bureau of Detectives - Area South'],
    ['630', 'Bureau of Detectives - Area North'],
    ['701', 'Public Transportation Section'],
    ['702', 'CTA Security Unit'],
    ['704', 'Transit Security Unit'],
    ['711', 'Violence Reduction Initiative - North'],
    ['712', 'Violence Reduction Initiative - South'],
]
UNITS_DICT = dict(UNITS)

GENDER = [
    ['M', "Male"],
    ['F', 'Female'],
]

GENDER_DICT = dict(GENDER)

RACES = [
    'Black',
    'Hispanic',
    'White',
    'Asian',
    'Unknown',
    'Native American',
]
RACES = [[x, x] for x in RACES]
RACES_DICT = dict(RACES)

NO_DISCIPLINE_CODES = ('600', '000', '500', '700', '800', '900', ' ', None)
DISCIPLINE_CODES = [x[0] for x in OUTCOMES if x[0] not in NO_DISCIPLINE_CODES]
FINDINGS = [
    ['UN', 'Unfounded'],
    ['EX', 'Exonerated'],
    ['NS', 'Not Sustained'],
    ['SU', 'Sustained'],
    ['NC', 'No Cooperation'],
    ['NA', 'No Affidavit'],
    ['DS', 'Discharged']
]


OUTCOME_TEXT = [
    ['any discipline', 'Any discipline'],
    ['no discipline', 'No discipline'],
]
OUTCOME_TEXT_DICT = dict(OUTCOME_TEXT)

FINAL_FINDING_TEXT = [
    ['unsustained', 'Unsustained']
]
FINAL_FINDING_TEXT_DICT = dict(FINAL_FINDING_TEXT)


class Allegation(models.Model):
    record_id = models.IntegerField(null=True)
    crid = models.CharField(max_length=30, null=True, db_index=True)
    officer = models.ForeignKey(Officer, null=True)
    cat = models.ForeignKey(AllegationCategory, null=True)
    recc_finding = models.CharField(choices=FINDINGS, max_length=2, null=True, db_index=True)
    recc_outcome = models.CharField(choices=OUTCOMES, max_length=3, null=True, db_index=True)
    final_finding = models.CharField(choices=FINDINGS, max_length=2, null=True, db_index=True)
    final_outcome = models.CharField(choices=OUTCOMES, max_length=3, null=True, db_index=True)
    final_outcome_class = models.CharField(max_length=20, null=True)

    areas = models.ManyToManyField('Area', blank=True)
    location = models.CharField(max_length=20, null=True)
    add1 = models.IntegerField(null=True)
    add2 = models.CharField(max_length=255, null=True)
    city = models.CharField(max_length=255, null=True)
    incident_date = models.DateTimeField(null=True)
    incident_date_only = models.DateField(null=True, db_index=True)
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    investigator_name = models.CharField(max_length=255, null=True, db_index=True)
    investigator = models.ForeignKey('common.Investigator', null=True)
    point = models.PointField(srid=4326, null=True, blank=True)
    objects = AllegationManager()

    document_id = models.IntegerField(null=True)
    document_normalized_title = models.CharField(max_length=255, null=True)
    document_title = models.CharField(max_length=255, null=True)
    document_requested = models.BooleanField(default=False)
    document_pending = models.BooleanField(default=False)
    number_of_request = models.IntegerField(default=0)

    @property
    def beat(self):
        beats = self.areas.filter(type='police-beats')
        if beats:
            return beats[0]
        return False

    def __str__(self):
        return "%s" % self.crid


class Investigator(models.Model):
    raw_name = models.CharField(max_length=160)
    name = models.CharField(max_length=160)
    complaint_count = models.IntegerField(default=0)
    discipline_count = models.IntegerField(default=0)
    current_rank = models.CharField(max_length=50, null=True)
    current_report = models.CharField(max_length=4, null=True)

    @property
    def tag_value(self):
        return {
            'text': self.name,
            'value': self.pk,
        }
