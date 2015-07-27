from allegation.models.allegation_query_set import AllegationQuerySet
from allegation.models.query_set_manager import QuerySetManager


class AllegationManager(QuerySetManager):
    def get_queryset(self):
        return AllegationQuerySet(self.model, using=self._db)

    def by_filter(self, allegation_query_filters):
        return self.get_queryset().by_filter(allegation_query_filters)

    def by_officer_names(self, officer_names=[]):
        return self.get_queryset().by_officer_names(officer_names)

    def by_latlng(self, latlng=[], radius=500):
        return self.get_queryset().by_latlng(latlng, radius)

    def by_allegation_filter(self, allegation_query_filter):
        return self.get_queryset().by_allegation_filter(allegation_query_filter)
