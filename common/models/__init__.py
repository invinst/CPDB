from slugify import slugify
from datetime import date

from django.contrib.auth.models import AbstractUser
from django.contrib.gis.db import models
from django.core.urlresolvers import reverse

from common.constants import FINDINGS, OUTCOMES, ACTIVE_CHOICES, CITIZEN_DEPTS, LOCATION_CHOICES, RANKS
from common.models.time_stamp import TimeStampedModel
from allegation.models.managers import AllegationManager, OfficerAllegationManager, DisciplinedManager
from common.models.suggestible import (
    MobileSuggestibleOfficer, MobileSuggestibleAllegation)


class User(AbstractUser):
    pass


class Officer(MobileSuggestibleOfficer, TimeStampedModel):
    officer_first = models.CharField(
        max_length=255, null=True, db_index=True, blank=True)
    officer_last = models.CharField(
        max_length=255, null=True, db_index=True, blank=True)
    gender = models.CharField(max_length=1, null=True, blank=True)
    race = models.CharField(max_length=50, null=True, blank=True)
    appt_date = models.DateField(null=True, blank=True)
    unit = models.CharField(max_length=5, null=True, blank=True)
    rank = models.CharField(choices=RANKS, max_length=5, null=True, blank=True)
    star = models.FloatField(null=True, blank=True)
    allegations_count = models.IntegerField(default=0, blank=True, null=True)
    discipline_count = models.IntegerField(default=0, blank=True, null=True)
    birth_year = models.IntegerField(default=0, blank=True, null=True)
    active = models.CharField(
        choices=ACTIVE_CHOICES, max_length='10', default='Unknown')

    @property
    def age(self):
        return date.today().year - self.birth_year if self.birth_year else None

    @property
    def absolute_url(self):
        # we get absolute url from #get_absolute_url since it's required for json_serializer to return absolute_url
        return self.get_absolute_url()

    def get_absolute_url(self):
        return '{path}{pk}'.format(path=reverse("officer:detail"), pk=self.pk)

    @property
    def absolute_view_url(self):
        return reverse('officer:view', kwargs={'slug': self.slug, 'pk': self.pk})

    def __str__(self):
        return self.display_name

    @property
    def display_name(self):
        return '{self.officer_first} {self.officer_last}'.format(self=self)

    @property
    def slug(self):
        return slugify(self.display_name)

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


class AllegationCategory(TimeStampedModel):
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


class Area(TimeStampedModel):
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=30, choices=[['beat', 'Beat'], ['neighborhood', 'Neighborhood'],
                                                    ['school-grounds', 'School Grounds'], ['ward', 'Ward'],
                                                    ['police-districts', 'Police District']], db_index=True)
    polygon = models.MultiPolygonField(srid=4326, null=True, blank=True)
    objects = models.GeoManager()


class Allegation(MobileSuggestibleAllegation, TimeStampedModel):
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
    officer_age = models.IntegerField(null=True, db_index=True)
    objects = OfficerAllegationManager()
    disciplined = DisciplinedManager()


class Investigator(TimeStampedModel):
    raw_name = models.CharField(max_length=160)
    name = models.CharField(max_length=160)
    complaint_count = models.IntegerField(default=0)
    discipline_count = models.IntegerField(default=0)
    current_rank = models.CharField(max_length=50, null=True)
    current_report = models.CharField(max_length=4, null=True)
    unit = models.CharField(max_length=50, null=True)
    agency = models.CharField(choices=[['IPRA', 'IPRA'], ['IAD', 'IAD']], max_length=10)

    def __str__(self):
        return self.name

    @property
    def tag_value(self):
        return {
            'text': self.name,
            'value': self.pk,
        }

    @property
    def absolute_view_url(self):
        return self.get_absolute_url()

    @property
    def absolute_url(self):
        return self.get_absolute_url()

    def get_absolute_url(self):
        # we get absolute url from #get_absolute_url since it's required for json_serializer to return absolute_url
        return reverse('investigator:view', kwargs={'slug': self.slug, 'pk': self.pk})

    @property
    def slug(self):
        return slugify(self.name)


class PendingPdfAllegation(models.Model):
    crid = models.CharField(max_length=30, null=True, db_index=True)
    raw_content = models.TextField(blank=True, null=True)
    notification_date = models.DateField(null=True, blank=True)
    areas = models.ManyToManyField('Area', blank=True)
    cat = models.ForeignKey(AllegationCategory, null=True, blank=True)
    finding = models.CharField(max_length=255, blank=True, null=True)
    summary = models.TextField(blank=True, null=True)
    errors = models.TextField(blank=True, null=True)


class DocumentCrawler(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    num_documents = models.IntegerField()
