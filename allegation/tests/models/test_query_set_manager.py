import datetime

from allegation.factories import AllegationFactory, OfficerAllegationFactory
from common.tests.core import SimpleTestCase
from common.models import Allegation, OfficerAllegation


class QuerySetManagerTestCase(SimpleTestCase):
    def test_update_auto_set_document_status(self):
        allegation = AllegationFactory(
            document_requested=True, document_pending=True)
        Allegation.objects.filter(crid=allegation.crid).update(document_id=1)

        document_requesteds = Allegation.objects.filter(crid=allegation.crid)\
            .values_list('document_requested', flat=True)
        any(document_requesteds).should.be.false

        document_pendings = Allegation.objects.filter(crid=allegation.crid)\
            .values_list('document_pending', flat=True)
        any(document_pendings).should.be.false

        Allegation.objects.filter(crid=allegation.crid)\
            .update(document_pending=False)

        document_requesteds = Allegation.objects.filter(crid=allegation.crid)\
            .values_list('document_requested', flat=True)
        all(document_requesteds).should.be.true

        document_ids = Allegation.objects.filter(crid=allegation.crid)\
            .values_list('document_id', flat=True)
        all([doc_id == 0 for doc_id in document_ids]).should.be.true

    def test_force_update_document_status(self):
        allegation = AllegationFactory(
            document_requested=True, document_pending=True)
        Allegation.objects.filter(crid=allegation.crid).update(
            document_id=1, document_requested=True, document_pending=True)

        document_requesteds = Allegation.objects.filter(crid=allegation.crid)\
            .values_list('document_requested', flat=True)
        all(document_requesteds).should.be.true

        document_pendings = Allegation.objects.filter(crid=allegation.crid)\
            .values_list('document_pending', flat=True)
        all(document_pendings).should.be.true

        Allegation.objects.filter(crid=allegation.crid).update(
            document_pending=False, document_requested=False, document_id=1)

        document_requesteds = Allegation.objects.filter(crid=allegation.crid)\
            .values_list('document_requested', flat=True)
        any(document_requesteds).should.be.false

        document_ids = Allegation.objects.filter(crid=allegation.crid)\
            .values_list('document_id', flat=True)
        all([doc_id == 1 for doc_id in document_ids]).should.be.true

    def test_null_last_order_by(self):
        OfficerAllegationFactory(start_date=datetime.datetime(2010, 11, 1))
        OfficerAllegationFactory(start_date=None)

        [o.start_date for o in
         OfficerAllegation.objects.all().null_last_order_by('-start_date')].index(None).should.equal(1)
        [o.start_date for o in
         OfficerAllegation.objects.all().null_last_order_by('start_date')].index(None).should.equal(0)

        OfficerAllegation.objects.all().delete()

        OfficerAllegationFactory(allegation=AllegationFactory(incident_date=datetime.datetime(2011, 10, 1)))
        OfficerAllegationFactory(allegation=AllegationFactory(incident_date=None))

        [o.allegation.incident_date for o in
         OfficerAllegation.objects.all().null_last_order_by('-allegation__incident_date')].index(None).should.equal(1)
        [o.allegation.incident_date for o in
         OfficerAllegation.objects.all().null_last_order_by('allegation__incident_date')].index(None).should.equal(0)
