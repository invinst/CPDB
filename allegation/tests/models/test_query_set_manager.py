import datetime

from allegation.factories import AllegationFactory, OfficerAllegationFactory, OfficerFactory
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

    def test_create_officer_allegation_with_officer_age(self):
        officer = OfficerFactory(birth_year=1984)
        allegation = AllegationFactory(incident_date=datetime.datetime(2010, 1, 1))
        officer_allegation = OfficerAllegationFactory(officer=officer, allegation=allegation)
        officer_allegation.officer_age.should.equal(26)
        OfficerAllegationFactory(allegation=AllegationFactory(incident_date=None)).officer_age.should.be.none
