from django.core import management
from allegation.factories import ComplainingWitnessFactory, OfficerFactory
from common.management.commands.fix_race import RACES
from common.models import ComplainingWitness, Officer
from common.tests.core import SimpleTestCase


class TestFixRaces(SimpleTestCase):
    def setUp(self):
        Officer.objects.all().delete()
        ComplainingWitness.objects.all().delete()
        self.good_races = [x[1] for x in RACES]  # pardon the variable name
        self.bad_races = [x[0] for x in RACES]  # again, see ^
        for race in RACES:
            ComplainingWitnessFactory(race=race[0])
            OfficerFactory(race=race[0])

    def test_fix_races(self):
        management.call_command('fix_race')

        for check_type in [ComplainingWitness.objects.all(), Officer.objects.all()]:
            for item in check_type:
                self.good_races.should.contain(item.race)

    def test_bad_races(self):
        management.call_command('fix_race')

        for check_type in [ComplainingWitness.objects.all(), Officer.objects.all()]:
            for item in check_type:
                self.bad_races.shouldnt.contain(item.race)
