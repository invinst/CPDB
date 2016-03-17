from rest_framework import viewsets
from rest_framework import filters

from dashboard.authentication import SessionAuthentication
from dashboard.query_builders import AllegationDocumentQueryBuilder
from document.models import Document
from dashboard.serializers import DocumentSerializer, DocumentSingleSerializer


class AdminAllegationRequestViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    authentication_classes = (SessionAuthentication,)
    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter,)
    filter_fields = ('type',)
    ordering = ('-number_of_request',)
    ordering_fields = ('last_requested', 'number_of_request',)

    def get_queryset(self):
        query_set = super(AdminAllegationRequestViewSet, self).get_queryset()

        if 'crid' in self.request.GET:
            document_type = self.request.GET.get('document_type', 'CR')
            query_set = query_set.filter(allegation__crid=self.request.GET.get('crid'), type=document_type)
        else:
            request_document_type = self.request.GET.get('request_document_type', 'All')
            query_set = query_set.filter(AllegationDocumentQueryBuilder().build({
                'request_type': request_document_type,
            }))

        return query_set

    def get_object(self):
        document = super(AdminAllegationRequestViewSet, self).get_object()

        requests = document.requestemails.all()
        queries = [
            {'query': request.session.query.get('filters', {}), 'email': request.email}
            for request in requests]
        document.queries = queries
        return document

    def get_serializer_class(self, *args, **kwargs):
        if self.kwargs.get('pk'):
            return DocumentSingleSerializer
        return DocumentSerializer
