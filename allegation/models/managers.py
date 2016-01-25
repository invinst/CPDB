from django.contrib.gis.db.models import GeoManager
from django.db import models

from allegation.models.query_sets import AllegationQuerySet, OfficerAllegationQuerySet
from common.constants import DISCIPLINE_CODES


class AllegationManager(GeoManager):
    def get_queryset(self):
        return AllegationQuerySet(self.model, using=self._db)


class OfficerAllegationManager(models.Manager):
    def get_queryset(self):
        return OfficerAllegationQuerySet(self.model, using=self._db)


class DisciplinedManager(GeoManager):
    def filter(self, **kwargs):
        return super(DisciplinedManager, self).filter(final_outcome__in=DISCIPLINE_CODES, **kwargs)