from freezegun import freeze_time

from allegation.factories import OfficerFactory
from common.tests.core import SimpleTestCase


BEGIN_OF_2000 = '2000-01-01 01:01:01'


class OfficerModelTestCase(SimpleTestCase):
    @freeze_time(BEGIN_OF_2000)
    def test_age_property(self):
        officer = OfficerFactory(birth_year=1983)
        officer.age.should.equal(17)

    @freeze_time(BEGIN_OF_2000)
    def test_age_property_given_no_birth_year(self):
        officer = OfficerFactory(birth_year=None)
        officer.age.should.equal(None)
