from haystack import indexes

from common.models import Officer, AllegationCategory, Allegation, Investigator, Area, OfficerAllegation
from search.models.session_alias import SessionAlias
from search.models.proxy_models import AllegationCategoryProxy, AllegationProxy
from search.search_backends import CustomEdgeNgramField, CustomNgramField, CustomIntegerNgramField


class SuggestionBaseIndex(indexes.SearchIndex):
    text = indexes.CharField(document=True, use_template=True)

    def index_queryset(self, using=None):
        return self.get_model().objects.all()

    def get_model(self):
        return self.DEFAULT_MODEL

    def get_updated_field(self):
        return 'modified_at'

    class Meta:
        abstract = True


class OfficerIndex(SuggestionBaseIndex, indexes.Indexable):
    DEFAULT_MODEL = Officer

    officer_name = CustomNgramField()
    officer_star = CustomIntegerNgramField(model_attr='star', null=True)
    officer_unit = CustomNgramField(model_attr='unit', null=True)

    officer_id = indexes.IntegerField(model_attr='id')
    officer_allegations_count = indexes.IntegerField(model_attr='allegations_count')
    officer_star_sort = indexes.IntegerField(model_attr='star', null=True)

    def prepare_officer_name(self, obj):
        return '{first} {last}'.format(first=obj.officer_first, last=obj.officer_last)


class AllegationIndex(SuggestionBaseIndex, indexes.Indexable):
    DEFAULT_MODEL = Allegation

    allegation_crid = CustomNgramField(model_attr='crid')
    allegation_summary = CustomNgramField(model_attr='summary', null=True)

    allegation_crid_sort = indexes.CharField(model_attr='crid')


class AllegationDistinctCityIndex(SuggestionBaseIndex, indexes.Indexable):
    DEFAULT_MODEL = AllegationProxy

    allegation_distinct_city = CustomNgramField(model_attr='city', null=True)

    def index_queryset(self, using=None):
        # This is for PostgreSQL only
        return self.get_model().objects.all().distinct('city')

    def build_queryset(self, using=None, start_date=None, end_date=None):
        # A hack for the this to work
        index = super(AllegationDistinctCityIndex, self).build_queryset(using, start_date, end_date)
        return index.order_by()


class AllegationCategoryIndex(SuggestionBaseIndex, indexes.Indexable):
    DEFAULT_MODEL = AllegationCategory

    allegationcategory_name_and_id = CustomNgramField()

    allegationcategory_id = indexes.IntegerField(model_attr='id')
    allegationcategory_allegation_name = indexes.CharField(model_attr='allegation_name')
    allegationcategory_cat_id = indexes.CharField(model_attr='cat_id')
    allegationcategory_allegation_count = indexes.IntegerField(model_attr='allegation_count')

    def prepare_allegationcategory_name_and_id(self, obj):
        return '{name} {id}'.format(name=obj.allegation_name, id=obj.cat_id)


class AllegationCategoryDistinctCategoryIndex(SuggestionBaseIndex, indexes.Indexable):
    DEFAULT_MODEL = AllegationCategoryProxy

    allegationcategory_distinct_category = CustomNgramField(model_attr='category')

    allegationcategory_distinct_category_count = indexes.IntegerField(model_attr='category_count')

    def index_queryset(self, using=None):
        # This is for PostgreSQL only
        return self.get_model().objects.all().distinct('category')

    def build_queryset(self, using=None, start_date=None, end_date=None):
        # A hack for the this to work
        index = super(AllegationCategoryDistinctCategoryIndex, self).build_queryset(using, start_date, end_date)
        return index.order_by()


class InvestigatorIndex(SuggestionBaseIndex, indexes.Indexable):
    DEFAULT_MODEL = Investigator

    investigator_name = CustomNgramField(model_attr='name')

    investigator_id = indexes.IntegerField(model_attr='id')
    investigator_complaint_count = indexes.CharField(model_attr='complaint_count')

    def prepare_investigator_complaint_count(self, obj):
        return OfficerAllegation.objects.filter(allegation__investigator=obj).count()


class AreaIndex(SuggestionBaseIndex, indexes.Indexable):
    DEFAULT_MODEL = Area

    area_name = CustomEdgeNgramField(model_attr='name')

    area_id = indexes.IntegerField(model_attr='id')
    area_type = indexes.CharField(model_attr='type')


class SessionAliasIndex(SuggestionBaseIndex, indexes.Indexable):
    DEFAULT_MODEL = SessionAlias

    sessionalias_alias = CustomNgramField(model_attr='alias')

    sessionalias_title = indexes.CharField(model_attr='title')
    sessionalias_session_id = indexes.IntegerField()

    def prepare_sessionalias_session_id(self, obj):
        return obj.session.id
