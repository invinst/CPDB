from django.contrib.gis.db.models import GeoManager
from django.db import models

from allegation.models.query_sets import AllegationQuerySet, OfficerAllegationQuerySet


class AllegationManager(GeoManager):
    def get_queryset(self):
        return AllegationQuerySet(self.model, using=self._db)


class OfficerAllegationManager(models.Manager):
    def get_queryset(self):
        return OfficerAllegationQuerySet(self.model, using=self._db)
