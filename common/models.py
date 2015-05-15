from django.contrib.auth.models import AbstractUser
from django.contrib.gis.db import models


class User(AbstractUser):
    pass


class Officer(models.Model):
    officer_first = models.CharField(max_length=255, null=True)
    officer_last = models.CharField(max_length=255, null=True)
    gender = models.CharField(max_length=1, null=True)
    race = models.CharField(max_length=50, null=True)
    appt_date = models.DateField(null=True)
    unit = models.CharField(max_length=5, null=True)
    rank = models.CharField(max_length=5, null=True)
    star = models.FloatField(null=True)

    def __str__(self):
        return "%(last)s %(first)s" % {'last':self.officer_last,'first':self.officer_first}

class OfficerHistory(models.Model):
    officer = models.ForeignKey(Officer, null=True)
    unit = models.CharField(max_length=5, null=True)
    rank = models.CharField(max_length=5, null=True)
    star = models.FloatField(null=True)
    as_of = models.DateField(null=True)


class PoliceWitness(models.Model):
    pwit_id = models.IntegerField(primary_key=True)
    crid = models.CharField(max_length=30, null=True)
    gender = models.CharField(max_length=1, null=True)
    race = models.CharField(max_length=50, null=True)
    officer = models.ForeignKey(Officer, null=True)



class ComplainingWitness(models.Model):
    cwit_id = models.IntegerField(primary_key=True)
    crid = models.CharField(max_length=30, null=True)
    gender = models.CharField(max_length=1, null=True)
    race = models.CharField(max_length=50, null=True)


class AllegationCategory(models.Model):
    cat_id = models.CharField(primary_key=True, max_length=255)
    category = models.CharField(max_length=255, null=True)
    allegation_name = models.CharField(max_length=255, null=True)

    def __str__(self):
        return self.allegation_name

class Neighborhood(models.Model):
    name = models.CharField(max_length=100)
    polygon = models.MultiPolygonField(srid=4326, null=True, blank=True)
    objects = models.GeoManager()

class Beat(models.Model):
    name = models.CharField(max_length=100)
    polygon = models.MultiPolygonField(srid=4326, null=True, blank=True)
    objects = models.GeoManager()


class Allegation(models.Model):
    record_id = models.IntegerField(null=True)
    crid = models.CharField(max_length=30, null=True)
    officer = models.ForeignKey(Officer, null=True)
    cat = models.ForeignKey(AllegationCategory, null=True)
    recc_finding = models.CharField(max_length=255, null=True)
    recc_outcome = models.CharField(max_length=5, null=True)
    final_finding = models.CharField(max_length=255, null=True)
    final_outcome = models.CharField(max_length=5, null=True)

    beat = models.ForeignKey('Beat', null=True, blank=True)
    neighborhood = models.ForeignKey('Neighborhood', null=True, blank=True)
    location = models.CharField(max_length=20, null=True)
    add1 = models.IntegerField(null=True)
    add2 = models.CharField(max_length=255, null=True)
    city = models.CharField(max_length=255, null=True)
    incident_date = models.DateTimeField(null=True)
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    investigator = models.CharField(max_length=255, null=True)
    point = models.PointField(srid=4326,null=True,blank=True)
    objects = models.GeoManager()

    def save(self,*args,**kwargs):
        if self.location and not self.point:
            #geolocate
            pass
        super(Allegation,self).save(*args,**kwargs)

    def __str__(self):
        return "%s" % self.crid

