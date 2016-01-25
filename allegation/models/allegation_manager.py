from django.contrib.gis.db.models import GeoManager, Manager

from allegation.models.allegation_query_set import AllegationQuerySet
from common.constants import DISCIPLINE_CODES


class AllegationManager(GeoManager):
    def get_queryset(self):
        return AllegationQuerySet(self.model, using=self._db)


class DisciplinedManager(Manager):
    def filter(self, **kwargs):
        return super(DisciplinedManager, self).filter(final_outcome__in=DISCIPLINE_CODES, **kwargs)