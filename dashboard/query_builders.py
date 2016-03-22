from django.db.models.query_utils import Q


DOCUMENT_REQUEST_FILTERS = {
    "All": Q(),
    "Missing":
        Q(requested=False) & (Q(documentcloud_id=None) | Q(documentcloud_id=0)),
    "Requested":
        Q(pending=False) & Q(requested=True) &
        (Q(documentcloud_id=None) | Q(documentcloud_id=0)),
    "Fulfilled": Q(documentcloud_id__gt=0),
    "Pending": Q(pending=True) & Q(requested=True) &
        (Q(documentcloud_id=None) | Q(documentcloud_id=0)),
}


class AllegationDocumentQueryBuilder(object):
    """
    Build Q queries from query params.

    Expose a single method: `build`
    """

    def build(self, query_params):
        request_type = query_params.get('request_type', 'All')
        queries = DOCUMENT_REQUEST_FILTERS[request_type]
        if 'document_type' in query_params:
            queries = Q(type=query_params['document_type']) & queries

        return queries
