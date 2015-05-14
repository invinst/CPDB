from django.contrib.auth.models import AbstractUser
from django.db.models import IntegerField
from django.db.models.base import Model
from django.db.models.fields import CharField, DateTimeField, DateField, FloatField
from django.db.models.fields.related import ForeignKey


class User(AbstractUser):
    pass


class Officer(Model):
    officer_first = CharField(max_length=255, null=True, verbose_name='Officer first name')
    officer_last = CharField(max_length=255, null=True, verbose_name='Officer last name')
    gender = CharField(max_length=1, null=True)
    race = CharField(max_length=50, null=True)
    appt_date = DateField(null=True)
    unit = CharField(max_length=5, null=True)
    rank = CharField(max_length=5, null=True)
    star = FloatField(null=True, verbose_name='Badge number')


class OfficerHistory(Model):
    officer = ForeignKey(Officer, null=True)
    unit = CharField(max_length=5, null=True)
    rank = CharField(max_length=5, null=True)
    star = FloatField(null=True)
    as_of = DateField(null=True)


class PoliceWitness(Model):
    pwit_id = IntegerField(primary_key=True)
    crid = CharField(max_length=30, null=True)
    gender = CharField(max_length=1, null=True)
    race = CharField(max_length=50, null=True)
    officer = ForeignKey(Officer, null=True)


class ComplainingWitness(Model):
    cwit_id = IntegerField(primary_key=True)
    crid = CharField(max_length=30, null=True)
    gender = CharField(max_length=1, null=True)
    race = CharField(max_length=50, null=True)


class AllegationCategory(Model):
    cat_id = CharField(primary_key=True, max_length=255)
    category = CharField(max_length=255, null=True, verbose_name='Complaint type')
    allegation_name = CharField(max_length=255, null=True)


class Allegation(Model):
    record_id = IntegerField(null=True)
    crid = CharField(max_length=30, null=True, verbose_name='Complaint ID')
    officer = ForeignKey(Officer, null=True)
    cat = ForeignKey(AllegationCategory, null=True)
    recc_finding = CharField(max_length=255, null=True)
    recc_outcome = CharField(max_length=5, null=True)
    final_finding = CharField(max_length=255, null=True)
    final_outcome = CharField(max_length=5, null=True, verbose_name='Discipline type')
    beat = CharField(max_length=4, null=True)
    location = CharField(max_length=20, null=True)
    add1 = IntegerField(null=True)
    add2 = CharField(max_length=255, null=True)
    city = CharField(max_length=255, null=True)
    incident_date = DateTimeField(null=True)
    start_date = DateField(null=True, verbose_name='Start date')
    end_date = DateField(null=True, verbose_name='End date')
    investigator = CharField(max_length=255, null=True)

