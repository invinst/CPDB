from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.db import models
from django.db.models.query_utils import Q


class AllegationQuerySet(models.query.QuerySet):
    def by_allegation_filter(self, allegation_query_filter):
        conditions, filters = allegation_query_filter.allegation_filters()
        officer_names = allegation_query_filter.officer_names()
        latlng = allegation_query_filter.latlng()
        radius = allegation_query_filter.radius()

        return self.by_filter(conditions, filters).by_officer_names(officer_names).by_latlng(latlng, radius)

    def by_filter(self, conditions, filters):
        return self.filter(*conditions, **filters)

    def by_officer_names(self, names):
        cond = Q()

        for name in names:
            parts = name.split(' ')
            if len(parts) > 1:
                cond = Q(officer__officer_first__istartswith=parts[0])
                cond = cond | Q(officer__officer_last__istartswith=" ".join(parts[1:]))
            else:
                cond = Q(officer__officer_first__istartswith=name) | Q(officer__officer_last__istartswith=name)

        return self.filter(cond)

    def by_latlng(self, latlng, radius):
        if len(latlng) == 2:
            point = Point(float(latlng[1]), float(latlng[0]))
            return self.filter(point__distance_lt=(point, D(m=radius)))

        return self
