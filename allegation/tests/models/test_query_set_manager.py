from allegation.models.query_set_manager import QuerySetManager
from allegation.factories import AllegationFactory
from common.tests.core import SimpleTestCase
from common.models import Allegation


class QuerySetManagerTestCase(SimpleTestCase):
    def test_raise_exception_if_subclass_get_queryset_is_not_implemented(self):
        queryset_manager = QuerySetManager()
        self.assertRaises(NotImplementedError, queryset_manager.get_queryset)

    def test_update_auto_set_document_status(self):
        allegation = AllegationFactory(document_requested=True, document_pending=True)
        Allegation.objects.filter(crid=allegation.crid).update(document_id=1)

        document_requesteds = Allegation.objects.filter(crid=allegation.crid).values_list('document_requested', flat=True)
        any(document_requesteds).should.be.false

        document_pendings = Allegation.objects.filter(crid=allegation.crid).values_list('document_pending', flat=True)
        any(document_pendings).should.be.false

        Allegation.objects.filter(crid=allegation.crid).update(document_pending=False)

        document_requesteds = Allegation.objects.filter(crid=allegation.crid).values_list('document_requested', flat=True)
        all(document_requesteds).should.be.true

        document_ids = Allegation.objects.filter(crid=allegation.crid).values_list('document_id', flat=True)
        all([doc_id == 0 for doc_id in document_ids]).should.be.true

    def test_force_update_document_status(self):
        allegation = AllegationFactory(document_requested=True, document_pending=True)
        Allegation.objects.filter(crid=allegation.crid).update(document_id=1, document_requested=True, document_pending=True)

        document_requesteds = Allegation.objects.filter(crid=allegation.crid).values_list('document_requested', flat=True)
        all(document_requesteds).should.be.true

        document_pendings = Allegation.objects.filter(crid=allegation.crid).values_list('document_pending', flat=True)
        all(document_pendings).should.be.true

        Allegation.objects.filter(crid=allegation.crid).update(document_pending=False, document_requested=False, document_id=1)

        document_requesteds = Allegation.objects.filter(crid=allegation.crid).values_list('document_requested', flat=True)
        any(document_requesteds).should.be.false

        document_ids = Allegation.objects.filter(crid=allegation.crid).values_list('document_id', flat=True)
        all([doc_id == 1 for doc_id in document_ids]).should.be.true
