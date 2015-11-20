from django.apps import apps
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.db import models
from django.db.models.query_utils import Q
from allegation.utils.query import OfficerQuery


class AllegationQuerySet(models.query.QuerySet):

    @staticmethod
    def complaining_witness_table():
        return apps.get_model('common', 'ComplainingWitness')._meta.db_table

    @staticmethod
    def allegation_table():
        return apps.get_model('common', 'Allegation')._meta.db_table

    def by_allegation_filter(self, allegation_query_filter):
        conditions = allegation_query_filter.allegation_filters()
        officer_names = allegation_query_filter.officer_names()
        officer_allegation_count = allegation_query_filter.officer_allegation_count()
        officer_discipline_count = allegation_query_filter.officer_discipline_count()
        latlng = allegation_query_filter.latlng()
        radius = allegation_query_filter.radius()
        complainant_gender = allegation_query_filter.complainant_gender()
        complainant_race = allegation_query_filter.complainant_race()

        result = self
        if conditions:
            result = result.by_filter(conditions)

        if officer_names:
            result = result.by_officer_names(officer_names)

        if officer_allegation_count:
            result = result.by_officer_count(officer_allegation_count, 'allegations_count')

        if officer_discipline_count:
            result = result.by_officer_count(officer_discipline_count, 'discipline_count')

        if latlng:
            result = result.by_latlng(latlng, radius)

        if complainant_gender or complainant_race:
            result = result.join_complaining_witness()

        if complainant_gender:
            result = result.by_complainant_gender(complainant_gender)

        if complainant_race:
            result = result.by_complainant_race(complainant_race)

        return result

    def join_table(self, table):
        where = '{allegation_table}.crid={table}.crid'.format(
            allegation_table=self.allegation_table(),
            table=table
        )
        return self.extra(
            tables=[table],
            where=[where]
        )

    def join_complaining_witness(self):
        return self.join_table(self.complaining_witness_table())

    def by_complainant_field(self, field, value):
        if len(value) == 1:
            where = '{complaining_witness_table}.{field}=%s'
            value = value[0]
        else:
            where = '{complaining_witness_table}.{field} IN %s'
            value = tuple(value)
        where = where.format(
            complaining_witness_table=self.complaining_witness_table(),
            field=field
        )

        return self.extra(
            where=[where],
            params=[value]
        )

    def by_complainant_gender(self, gender):
        return self.by_complainant_field('gender', gender)

    def by_complainant_race(self, race):
        return self.by_complainant_field('race', race)

    def by_filter(self, conditions):
        return self.filter(*conditions)

    def by_officer_names(self, names):
        cond = Q()

        for name in names:
            cond |= OfficerQuery.condition_by_name(name, prefix='officer__')

        return self.filter(cond)

    def by_latlng(self, latlng, radius):
        if len(latlng) == 2:
            point = Point(float(latlng[1]), float(latlng[0]))
            return self.filter(point__distance_lt=(point, D(m=radius)))

        return self

    def by_officer_count(self, count, field='allegations_count'):
        return self.filter(OfficerQuery.condition_by_count(count, field=field, prefix='officer__'))

    def update(self, *args, **kwargs):
        if 'document_id' in kwargs and int(kwargs['document_id']) > 0:
            kwargs.setdefault('document_requested', False)
            kwargs.setdefault('document_pending', False)
        elif 'document_pending' in kwargs and kwargs['document_pending'] == False:
            kwargs.setdefault('document_requested', True)
            kwargs.setdefault('document_id', 0)

        return super(AllegationQuerySet, self).update(*args, **kwargs)
