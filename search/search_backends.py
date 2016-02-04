import haystack

from haystack.backends.elasticsearch_backend import ElasticsearchSearchBackend
from haystack.backends.elasticsearch_backend import ElasticsearchSearchEngine
from elasticsearch.exceptions import NotFoundError
from haystack.fields import NgramField, EdgeNgramField

from django.conf import settings


class CustomElasticBackend(ElasticsearchSearchBackend):

    def __init__(self, connection_alias, **connection_options):
        super(CustomElasticBackend, self).__init__(connection_alias, **connection_options)

        CUSTOM_SETTING = getattr(settings, 'ELASTICSEARCH_SETTINGS', None)

        if CUSTOM_SETTING is not None:
            setattr(self, 'DEFAULT_SETTINGS', CUSTOM_SETTING)

    def build_schema(self, fields):
        content_field_name, mapping = super(CustomElasticBackend, self).build_schema(fields)

        for field_name, field_class in fields.items():
            field_mapping = mapping[field_class.index_fieldname]

            index_analyzer = getattr(field_class, 'index_analyzer', None)
            search_analyzer = getattr(field_class, 'search_analyzer', None)

            if index_analyzer and search_analyzer:
                del(field_mapping['analyzer'])
                field_mapping['index_analyzer'] = index_analyzer
                field_mapping['search_analyzer'] = search_analyzer

            mapping.update({field_class.index_fieldname: field_mapping})

        return (content_field_name, mapping)

    def setup(self):
        try:
            self.existing_mapping = self.conn.indices.get_mapping(index=self.index_name)
        except NotFoundError:
            pass
        except Exception:
            if not self.silently_fail:
                raise

        unified_index = haystack.connections[self.connection_alias].get_unified_index()
        self.content_field_name, field_mapping = self.build_schema(unified_index.all_searchfields())
        # Override _boosting attribute here to make it work
        current_mapping = {
            'modelresult': {
                'properties': field_mapping
            }
        }

        if current_mapping != self.existing_mapping:
            try:
                self.conn.indices.create(index=self.index_name, body=self.DEFAULT_SETTINGS, ignore=400)
                self.conn.indices.put_mapping(index=self.index_name, doc_type='modelresult', body=current_mapping)
                self.existing_mapping = current_mapping
            except Exception:
                if not self.silently_fail:
                    raise

        self.setup_complete = True


class CustomElasticSearchEngine(ElasticsearchSearchEngine):
    backend = CustomElasticBackend


class CustomEdgeNgramField(EdgeNgramField):
    def __init__(self, **kwargs):
        self.analyzer = kwargs.pop('analyzer', None)
        self.index_analyzer = kwargs.pop('index_analyzer', 'edgengram_analyzer')
        self.search_analyzer = kwargs.pop('search_analyzer', 'standard')

        super(CustomEdgeNgramField, self).__init__(**kwargs)


class CustomNgramField(NgramField):
    def __init__(self, **kwargs):
        self.analyzer = kwargs.pop('analyzer', None)
        self.index_analyzer = kwargs.pop('index_analyzer', 'ngram_analyzer')
        self.search_analyzer = kwargs.pop('search_analyzer', 'standard')

        super(CustomNgramField, self).__init__(**kwargs)


class CustomIntegerNgramField(CustomNgramField):
    def prepare(self, obj):
        return self.convert(super(CustomIntegerNgramField, self).prepare(obj))

    def convert(self, value):
        if value is None:
            return None
        return int(value)
