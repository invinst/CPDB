from django.contrib.auth.models import AbstractUser
from django.contrib.gis.db import models


class User(AbstractUser):
    pass


class Officer(models.Model):
    officer_first = models.CharField(max_length=255, null=True, db_index=True)
    officer_last = models.CharField(max_length=255, null=True, db_index=True)
    gender = models.CharField(max_length=1, null=True)
    race = models.CharField(max_length=50, null=True)
    appt_date = models.DateField(null=True)
    unit = models.CharField(max_length=5, null=True)
    rank = models.CharField(max_length=5, null=True)
    star = models.FloatField(null=True, db_index=True)
    allegations_count = models.IntegerField(default=0)
    discipline_count = models.IntegerField(default=0)

    def __str__(self):
        return "%(last)s %(first)s" % {'last': self.officer_last, 'first': self.officer_first}


class OfficerHistory(models.Model):
    officer = models.ForeignKey(Officer, null=True)
    unit = models.CharField(max_length=5, null=True)
    rank = models.CharField(max_length=5, null=True)
    star = models.FloatField(null=True)
    as_of = models.DateField(null=True)


class PoliceWitness(models.Model):
    pwit_id = models.IntegerField(primary_key=True)
    complaint = models.ForeignKey('Complaint', null=True)
    gender = models.CharField(max_length=1, null=True)
    race = models.CharField(max_length=50, null=True)
    officer = models.ForeignKey(Officer, null=True)


class ComplainingWitness(models.Model):
    cwit_id = models.IntegerField(primary_key=True)
    complaint = models.ForeignKey('Complaint', null=True)
    gender = models.CharField(max_length=1, null=True)
    race = models.CharField(max_length=50, null=True)


class AllegationCategory(models.Model):
    cat_id = models.CharField(primary_key=True, max_length=255)
    category = models.CharField(max_length=255, null=True, db_index=True)
    allegation_name = models.CharField(max_length=255, null=True, db_index=True)
    allegation_count = models.IntegerField(default=0)
    category_count = models.IntegerField(default=0)

    def __str__(self):
        return str(self.allegation_name)


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
FINDINGS = [
    ['UN', 'Unfounded'],
    ['EX', 'Exonerated'],
    ['NS', 'Not Sustained'],
    ['SU', 'Sustained'],
    ['NC', 'No Cooperation'],
    ['NA', 'No Affidavit'],
    ['DS', 'Discharged']
]


class Complaint(models.Model):
    record_id = models.IntegerField(null=True)
    crid = models.CharField(max_length=30, null=True, db_index=True)
    officers = models.ManyToManyField(Officer)
    cat = models.ForeignKey(AllegationCategory, null=True)
    recc_finding = models.CharField(choices=FINDINGS, max_length=2, null=True, db_index=True)
    recc_outcome = models.CharField(choices=OUTCOMES, max_length=3, null=True, db_index=True)
    final_finding = models.CharField(choices=FINDINGS, max_length=2, null=True, db_index=True)
    final_outcome = models.CharField(choices=OUTCOMES, max_length=3, null=True, db_index=True)

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
    objects = models.GeoManager()


class Allegation(models.Model):
    record_id = models.IntegerField(null=True)
    crid = models.CharField(max_length=30, null=True, db_index=True)
    officer = models.ForeignKey(Officer, null=True)
    cat = models.ForeignKey(AllegationCategory, null=True)
    recc_finding = models.CharField(choices=FINDINGS, max_length=2, null=True, db_index=True)
    recc_outcome = models.CharField(choices=OUTCOMES, max_length=3, null=True, db_index=True)
    final_finding = models.CharField(choices=FINDINGS, max_length=2, null=True, db_index=True)
    final_outcome = models.CharField(choices=OUTCOMES, max_length=3, null=True, db_index=True)

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
    point = models.PointField(srid=4326, null=True, blank=True)
    objects = models.GeoManager()

    @property
    def beat(self):
        beats = self.areas.filter(type='beat')
        if beats:
            return beats[0]
        return False

    @property
    def neighborhood(self):
        n = self.areas.filter(type='neighborhood')
        if n:
            return n[0]
        return False

    def save(self,*args,**kwargs):
        if self.location and not self.point:
            # geolocate
            pass
        super(Allegation, self).save(*args, **kwargs)

    def __str__(self):
        return "%s" % self.crid

class Investigator(models.Model):
    raw_name = models.CharField(max_length=160)
    name = models.CharField(max_length=160)
    complaint_count = models.IntegerField(default=0)
