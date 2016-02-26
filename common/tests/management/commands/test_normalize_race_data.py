from django.core import management
from allegation.factories import OfficerFactory
from common.management.commands.normalize_race_data import OLD_EMPTY_RACE
from common.models import Officer
from common.tests.core import SimpleTestCase


class TestNormalizeRaceData(SimpleTestCase):
    def setUp(self):
        Officer.objects.all().delete()
        OfficerFactory(race=OLD_EMPTY_RACE)
        OfficerFactory(race='Hispanic')

    def test_normalize_race_data(self):
        management.call_command('normalize_race_data')
        Officer.objects.filter(race=OLD_EMPTY_RACE).count().should.be.equal(0)
        Officer.objects.filter(race='').count().should.be.equal(1)
        Officer.objects.exclude(race=OLD_EMPTY_RACE).count().should.be.equal(2)
