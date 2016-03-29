import datetime

from allegation.factories import AllegationFactory, OfficerAllegationFactory
from common.tests.core import SimpleTestCase
from common.models import OfficerAllegation


class QuerySetManagerTestCase(SimpleTestCase):
    def test_null_last_order_by(self):
        OfficerAllegationFactory(start_date=datetime.datetime(2010, 11, 1))
        OfficerAllegationFactory(start_date=None)

        [o.start_date for o in
         OfficerAllegation.objects.all().order_by('-start_date')].index(None).should.equal(1)
        [o.start_date for o in
         OfficerAllegation.objects.all().order_by('start_date')].index(None).should.equal(0)

        OfficerAllegation.objects.all().delete()

        OfficerAllegationFactory(allegation=AllegationFactory(incident_date=datetime.datetime(2011, 10, 1)))
        OfficerAllegationFactory(allegation=AllegationFactory(incident_date=None))

        [o.allegation.incident_date for o in
         OfficerAllegation.objects.all().order_by('-allegation__incident_date')].index(None).should.equal(1)
        [o.allegation.incident_date for o in
         OfficerAllegation.objects.all().order_by('allegation__incident_date')].index(None).should.equal(0)
