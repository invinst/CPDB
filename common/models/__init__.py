from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.contrib.gis.db import models
from django.core.urlresolvers import reverse
from django.db.models.query_utils import Q

from allegation.models.allegation_manager import AllegationManager
from common.models.suggestible import (
    MobileSuggestibleOfficer, MobileSuggestibleAllegation)


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

ACTIVE_CHOICES = [
    ['Yes', 'Active'],
    ['No', 'Inactive'],
    ['Unknown', 'Unknown']
]


class Officer(MobileSuggestibleOfficer, models.Model):
    officer_first = models.CharField(
        max_length=255, null=True, db_index=True, blank=True)
    officer_last = models.CharField(
        max_length=255, null=True, db_index=True, blank=True)
    gender = models.CharField(max_length=1, null=True, blank=True)
    race = models.CharField(max_length=50, null=True, blank=True)
    appt_date = models.DateField(null=True, blank=True)
    unit = models.CharField(max_length=5, null=True, blank=True)
    rank = models.CharField(max_length=5, null=True, blank=True)
    star = models.FloatField(null=True, blank=True)
    allegations_count = models.IntegerField(default=0, blank=True, null=True)
    discipline_count = models.IntegerField(default=0, blank=True, null=True)
    birth_year = models.IntegerField(default=0, blank=True, null=True)
    active = models.CharField(
        choices=ACTIVE_CHOICES, max_length='10', default='Unknown')

    @property
    def absolute_url(self):
        return self.get_absolute_url()

    def get_absolute_url(self):
        return reverse("officer:detail") + "?pk=%d" % self.pk

    def __str__(self):
        return self.display_name

    @property
    def display_name(self):
        return '{self.officer_first} {self.officer_last}'.format(self=self)

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
    allegation = models.ForeignKey('common.Allegation', null=True)
    gender = models.CharField(max_length=1, null=True)
    race = models.CharField(max_length=50, null=True)
    officer = models.ForeignKey(Officer, null=True)


class ComplainingWitness(models.Model):
    cwit_id = models.AutoField(primary_key=True)
    crid = models.CharField(max_length=30, null=True, db_index=True)
    allegation = models.ForeignKey('common.Allegation', null=True)
    gender = models.CharField(max_length=1, null=True)
    race = models.CharField(max_length=50, null=True)
    age = models.IntegerField(null=True)


CITIZEN_DEPTS = [
    ('citizen', 'Citizen'),
    ('dept', 'Dept'),
    ('?', 'Unknown')
]


class AllegationCategory(models.Model):
    id = models.AutoField(primary_key=True)
    cat_id = models.CharField(max_length=255)
    category = models.CharField(max_length=255, null=True, db_index=True)
    allegation_name = models.CharField(max_length=255, null=True, db_index=True)
    allegation_count = models.IntegerField(default=0)
    category_count = models.IntegerField(default=0)
    on_duty = models.BooleanField(default=False)
    citizen_dept = models.CharField(max_length=50, default='citizen', choices=CITIZEN_DEPTS)

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
    ['045', '45 Day Suspension'],
    ['060', '60 Day Suspension'],
    ['090', '90 Day Suspension'],
    ['100', 'Reprimand'],
    ['120', 'Suspended for 120 Days'],
    ['180', 'Suspended for 180 Days'],
    ['200', 'Suspended over 30 Days'],
    ['300', 'Administrative Termination'],
    ['400', 'Separation'],
    ['500', 'Reinstated by Police Board'],
    ['600', 'No Action Taken'],
    ['700', 'Reinstated by Court Action'],
    ['800', 'Resigned'],
    ['900', 'Penalty Not Served'],
    [None, 'Unknown'],
]
OUTCOMES_DICT = dict(OUTCOMES)

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
    ['M', 'Male'],
    ['F', 'Female'],
    ['X', 'Trans']
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

NO_DISCIPLINE_CODES = ('600', '000', '500', '700', '800', '900', '')
DISCIPLINE_CODES = [
    x[0] for x in OUTCOMES
    if x[0] not in NO_DISCIPLINE_CODES and x[0] is not None]
FINDINGS = [
    ['UN', 'Unfounded'],  # means final_outcome_class = not-sustained
    ['EX', 'Exonerated'],  # means final_outcome_class = not-sustained
    ['NS', 'Not Sustained'],  # means final_outcome_class = not-sustained
    ['SU', 'Sustained'],  # means final_outcome_class = sustained
    ['NC', 'No Cooperation'],  # means final_outcome_class = not-sustained
    ['NA', 'No Affidavit'],  # means final_outcome_class = not-sustained
    ['DS', 'Discharged'],  # means final_outcome_class = not-sustained
    ['ZZ', 'Unknown']  # means final_outcome_class = open-investigation
]
FINDINGS_DICT = dict(FINDINGS)

OUTCOME_TEXT_DICT = {
    'any discipline': {
        'text': 'Any discipline',
        'condition': {
            'final_finding': ['SU'],
            'final_outcome': DISCIPLINE_CODES,
        }
    },
    'no discipline': {
        'text': 'No discipline',
        'condition': {
            'final_finding': ['SU'],
            'final_outcome': NO_DISCIPLINE_CODES,
        }
    },
    '1-9 days': {
        'text': '1-9 days',
        'condition': {
            'final_outcome': [str(x).zfill(3) for x in range(1, 10)],
        }
    },
    '10-30 days': {
        'text': '10-30 day',
        'condition': {
            'final_outcome': [str(x).zfill(3) for x in range(10, 31)],
        }
    },

    '30 more days': {
        'text': '30+ days',
        'condition': {
            'final_outcome': ["045", "060", "090", "180", "200"],
        }
    },
}

FINAL_FINDING_TEXT_DICT = {
    'unsustained': {
        'text': 'Unsustained',
        'condition': {
            'final_finding': ['DS', 'EX', 'NA', 'NC', 'NS', 'UN']
        }
    }
}

HAS_FILTERS_TEXT_DICT = {
    'has:document': {
        'text': 'has:document',
        'condition': {
            'document_id__gt': [0]
        }
    },
    'has:map': {
        'text': 'has:map',
        'condition': {
            'point__isnull': [False]
        }
    },
    'has:address': {
        'text': 'has:address',
        'condition': {
            'add1_or_add2__isnotnull': [Q(add1__isnull=False) | Q(add2__isnull=False)]
        }
    },
    'has:location': {
        'text': 'has:location',
        'condition': {
            'location__isnull': [False]
        }
    },
    'has:summary': {
        'text': 'has:summary',
        'condition': {
            'document_id__isnull': [False]
        }
    },
    'has:identified': {
        'text': 'has:identified',
        'condition': {
            'officer__isnull': [False]
        }
    },
    'has:investigator': {
        'text': 'has:investigator',
        'condition': {
            'investigator__isnull': [False]
        }
    }
}

HAS_FILTERS_LIST = [
    (key, val['text']) for key, val in HAS_FILTERS_TEXT_DICT.items()
]

HAS_FILTERS_DICT = dict(HAS_FILTERS_LIST)

CUSTOM_FILTER_DICT = {
    'final_finding_text': FINAL_FINDING_TEXT_DICT,
    'outcome_text': OUTCOME_TEXT_DICT,
    'has_filters': HAS_FILTERS_TEXT_DICT,
}

LOCATION_CHOICES = [
    ['01', 'Food Sales/Restaurant'],
    ['02', 'Tavern/Liquor Store'],
    ['03', 'Other Business Establishment'],
    ['04', 'Police Building'],
    ['05', 'Lockup Facility'],
    ['06', 'Police Maintenance Facility'],
    ['07', 'CPD Automotive Pound Facility'],
    ['08', 'Other Police Property'],
    ['09', 'Police Communications System'],
    ['10', 'Court Room'],
    ['11', 'Public Transportation Veh./Facility'],
    ['12', 'Park District Property'],
    ['13', 'Airport'],
    ['14', 'Public Property - Other'],
    ['15', 'Other Private Premise'],
    ['16', 'Expressway/Interstate System'],
    ['17', 'Public Way - Other'],
    ['18', 'Waterway. Incl Park District'],
    ['19', 'Private Residence']
]

LCOATIONS_DICT = {}
for location in LOCATION_CHOICES:
    LCOATIONS_DICT[location[0]] = location[1]


class Allegation(MobileSuggestibleAllegation, models.Model):
    record_id = models.IntegerField(null=True, blank=True)
    crid = models.CharField(max_length=30, null=True, db_index=True)
    summary = models.TextField(null=True, blank=True)

    location = models.CharField(
        max_length=20, null=True, blank=True, choices=LOCATION_CHOICES)
    add1 = models.IntegerField(null=True, blank=True)
    add2 = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=255, null=True, blank=True)
    incident_date = models.DateTimeField(null=True, blank=True)
    incident_date_only = models.DateField(null=True, db_index=True, blank=True)
    investigator_name = models.CharField(
        max_length=255, null=True, db_index=True, blank=True)
    investigator = models.ForeignKey(
        'common.Investigator', null=True, blank=True)

    document_id = models.IntegerField(null=True, blank=True)
    document_normalized_title = models.CharField(
        max_length=255, null=True, blank=True)
    document_title = models.CharField(max_length=255, null=True, blank=True)
    document_requested = models.BooleanField(default=False)
    document_pending = models.BooleanField(default=False)
    number_of_request = models.IntegerField(default=0)
    last_requested = models.DateTimeField(default=timezone.now)
    areas = models.ManyToManyField('Area', blank=True)
    point = models.PointField(srid=4326, null=True, blank=True)

    beat = models.ForeignKey(
        'Area', null=True, blank=True, related_name='beats')

    source = models.CharField(null=True, max_length=20)

    objects = AllegationManager()

    def __str__(self):
        return '%s' % self.crid


class OfficerAllegation(models.Model):
    allegation = models.ForeignKey(Allegation, null=True)
    cat = models.ForeignKey(AllegationCategory, to_field='id', null=True)
    officer = models.ForeignKey(Officer, null=True)

    recc_finding = models.CharField(
        choices=FINDINGS, max_length=2, null=True, db_index=True, blank=True)
    recc_outcome = models.CharField(
        choices=OUTCOMES, max_length=3, null=True, db_index=True, blank=True)
    final_finding = models.CharField(
        choices=FINDINGS, max_length=2, null=True, db_index=True, blank=True)
    final_outcome = models.CharField(
        choices=OUTCOMES, max_length=3, null=True, db_index=True, blank=True)
    final_outcome_class = models.CharField(
        max_length=20, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    objects = models.GeoManager()


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


class PendingPdfAllegation(models.Model):
    crid = models.CharField(max_length=30, null=True, db_index=True)
    raw_content = models.TextField(blank=True, null=True)
    notification_date = models.DateField(null=True, blank=True)
    areas = models.ManyToManyField('Area', blank=True)
    cat = models.ForeignKey(AllegationCategory, null=True, blank=True)
    finding = models.CharField(max_length=255, blank=True, null=True)
    summary = models.TextField(blank=True, null=True)
    errors = models.TextField(blank=True, null=True)
