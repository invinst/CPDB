from django.apps import apps
from django.db import models
from django.db.models.query_utils import Q
from dashboard.views.allegation_request_view import DOCUMENT_REQUEST_FILTERS
from common.models import Allegation


class DocumentRequestQuerySet(models.query.QuerySet):

    @staticmethod
    def document_requestemail_table():
        return apps.get_model('document', 'RequestEmail')._meta.db_table

    @staticmethod
    def allegation_table():
        return apps.get_model('common', 'Allegation')._meta.db_table

    def get_filter(self):
        filter_allegation_document = (DOCUMENT_REQUEST_FILTERS['Requested']) | (DOCUMENT_REQUEST_FILTERS['Pending'])
        extra_raw_query = """
            select string_agg(email, ',')
            from {document_requestemail_table}
            where {document_requestemail_table}.crid = {allegation_table}.crid
            """.format(
                document_requestemail_table=self.document_requestemail_table(),
                allegation_table=self.allegation_table()
            )
        result = Allegation.objects.filter(filter_allegation_document).distinct('crid').extra(
            select={
                'emails': extra_raw_query
            }
        )

        return result
