import datetime

from allegation.factories import AllegationFactory
from common.models import Allegation
from common.tests.core import SimpleTestCase


class HourExtractTest(SimpleTestCase):
    def test_hour_look_up(self):
        allegation = AllegationFactory(incident_date=datetime.datetime(2007, 12, 16, 16, 30, 30))
        AllegationFactory(incident_date=datetime.datetime(2007, 12, 16, 7, 30, 30))

        allegations = Allegation.objects.filter(incident_date__hour__gte=10)
        allegations.should.have.length_of(1)
        allegations.first().id.should.be.equal(allegation.id)
