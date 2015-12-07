from django.http import QueryDict
from django.db.models import Q

from allegation.factories import AllegationFactory
from allegation.views.allegation_query_filter import AllegationQueryFilter
from common.tests.core import SimpleTestCase


class AllegationQueryFilterTestCase(SimpleTestCase):
    def test_query_null_value(self):
        allegation_filter = AllegationQueryFilter(QueryDict('final=null&final=not_null'), ignore_filters=None)
        allegation_filter.add_filter('final')
        allegation_filter.allegation_filters()

        allegation_filter.filters['final'].should.contain(None)
        allegation_filter.filters['final'].should.contain('not_null')

        cond_str = [str(cond) for cond in allegation_filter.conditions]
        cond_str.should.contain(str(Q() | Q(final__isnull=True) | Q(final='not_null')))

    def test_merge_query_cat_category(self):
        allegation = AllegationFactory()
        query = QueryDict('cat__category={category}'.format(category=allegation.cat.category))
        allegation_filter = AllegationQueryFilter(query, ignore_filters=None)
        allegation_filter.allegation_filters()
        allegation_filter.filters.should.contain('cat')
        allegation_filter.filters['cat'].should.equal([allegation.cat.cat_id])