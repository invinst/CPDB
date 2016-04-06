from django.contrib.gis.db.models import GeoManager, Manager
from django.db import models

from allegation.models.query_sets import AllegationQuerySet, OfficerAllegationQuerySet
from common.constants import DISCIPLINE_CODES


class AllegationManager(GeoManager):
    def get_queryset(self):
        return AllegationQuerySet(self.model, using=self._db)


def _calculate_officer_age(officer_allegation):
    try:
        officer_allegation.officer_age = \
            officer_allegation.allegation.incident_date_only.year - officer_allegation.officer.birth_year
    except (AttributeError, TypeError):
        pass


class OfficerAllegationManager(models.Manager):
    def get_queryset(self):
        return OfficerAllegationQuerySet(self.model, using=self._db)

    def create(self, **kwargs):
        officer_allegation = super(OfficerAllegationManager, self).create(**kwargs)
        _calculate_officer_age(officer_allegation)
        officer_allegation.save()
        return officer_allegation


class DisciplinedManager(Manager):
    def filter(self, **kwargs):
        return super(DisciplinedManager, self).filter(final_outcome__in=DISCIPLINE_CODES, **kwargs)
