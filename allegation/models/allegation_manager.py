from django.contrib.gis.db.models import GeoManager

from allegation.models.allegation_query_set import AllegationQuerySet


class AllegationManager(GeoManager):
    def get_queryset(self):
        return AllegationQuerySet(self.model, using=self._db)
