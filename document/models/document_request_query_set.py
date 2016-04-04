from django.apps import apps
from django.db import models

from dashboard.query_builders import AllegationDocumentQueryBuilder
from document.models import Document


class DocumentRequestQuerySet(models.query.QuerySet):

    @staticmethod
    def document_requestemail_table():
        return apps.get_model('document', 'RequestEmail')._meta.db_table

    @staticmethod
    def document_table():
        return apps.get_model('document', 'Document')._meta.db_table

    def get_filter(self, type):
        builder = AllegationDocumentQueryBuilder()
        filter_allegation_document = \
            builder.build({'request_type': 'Requested', 'document_type': type})\
            | builder.build({'request_type': 'Pending', 'document_type': type})

        extra_raw_query = '''
            select string_agg(email, ',')
            from {document_requestemail_table}
            where {document_requestemail_table}.document_id = {document_table}.id
        '''.format(
            document_requestemail_table=self.document_requestemail_table(),
            document_table=self.document_table()
        )

        result = Document.objects.filter(filter_allegation_document)\
            .select_related('allegation')\
            .extra(select={
                'emails': extra_raw_query
            })

        return result
