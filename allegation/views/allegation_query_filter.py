from django.db.models.query_utils import Q
from common.models import AllegationCategory, DISCIPLINE_CODES, NO_DISCIPLINE_CODES

FILTERS = [
    'crid',
    'areas__id',
    'cat',
    'neighborhood_id',
    'recc_finding',
    'final_outcome',
    'recc_outcome',
    'final_finding',
    'officer',
    'officer__star',
    'officer__unit',
    'officer__rank',
    'officer__gender',
    'officer__race',
    'investigator',
    'cat__category',
    'city'
]
DATE_FILTERS = ['incident_date_only']


# FIXME: Add more test for this one
class AllegationQueryFilter(object):
    def __init__(self, request, ignore_filters):
        self.request = request
        self.ignore_filters = ignore_filters or []
        self.raw_filters = []
        self.filters = {}
        self.conditions = []

    def add_filter(self, field):
        value = self.request.GET.getlist(field, [])
        if field == 'final_outcome':
            text = self.request.GET.get('outcome_text')
            if text:
                added_value = DISCIPLINE_CODES if text == 'any discipline' else NO_DISCIPLINE_CODES
                value += added_value
        if field == 'final_finding':
            text = self.request.GET.get('outcome_text')
            if text:
                value += ['SU']  # sustained

        if len(value) > 1:
            self.filters["%s__in" % field] = value

        elif value:
            self.filters[field] = value[0]

    def add_date_filter(self, field):
        condition = Q()

        field_name = '%s__range' % field
        date_ranges = self.request.GET.getlist(field_name)

        field_name = '%s__year' % field
        years = self.request.GET.getlist(field_name)

        field_name = '%s__year_month' % field
        year_months = self.request.GET.getlist(field_name)

        dates = self.request.GET.getlist(field)
        for date_range in date_ranges:
            date_range = date_range.split(',')
            condition = condition | Q(**{'%s__range' % field: date_range})
        for year in years:
            condition = condition | Q(**{"%s__year" % field: year})

        for year_month in year_months:
            year, month = year_month.split('-')
            condition = condition | Q(Q(**{"%s__year" % field: year}) & Q(**{"%s__month" % field: month}))

        formatted_dates = []
        for date in dates:
            formatted_dates.append(date.replace('/','-'))

        if dates:
            condition = condition | Q(**{"%s__in" % field: formatted_dates})

        self.conditions.append(condition)

    def available_filters(self):
        self.raw_filters = [x for x in FILTERS if x not in self.ignore_filters]
        return self

    def allegation_filters(self):
        self.available_filters().prepare_categories_filter()

        for filter_field in self.raw_filters:
            self.add_filter(filter_field)

        for date_filter in DATE_FILTERS:
            self.add_date_filter(date_filter)

        return self.conditions, self.filters

    def prepare_categories_filter(self):
        # Merge cat and cat_category
        if all(x in self.raw_filters for x in ['cat', 'cat_category']):
            if all(x in self.request.GET for x in ['cat', 'cat_category']):
                category_names = self.request.GET.getlist('cat__category')
                categories = AllegationCategory.objects.filter(category__in=category_names)
                cats = list(categories.values_list('cat_id', flat=True))
                value = self.request.GET.getlist('cat') + cats
                self.filters['cat__in'] = value
                self.raw_filters.remove('cat')
                self.raw_filters.remove('cat__category')

        return self

    def officer_names(self):
        return self.request.GET.getlist('officer_name', [])

    def latlng(self):
        return self.request.GET.get('latlng', '').split(',')

    def radius(self):
        return self.request.GET.get('radius', 500)

    def complainant_gender(self):
        return self.request.GET.getlist('complainant_gender', [])

    def complainant_race(self):
        return self.request.GET.getlist('complainant_race', [])
