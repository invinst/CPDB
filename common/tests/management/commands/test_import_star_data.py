import os

from django.core import management
from allegation.factories import OfficerFactory
from common.models import Officer, OfficerHistory, OfficerBadgeNumber
from common.tests.core import SimpleTestCase


class ImportStarData(SimpleTestCase):
    def setUp(self):
        if not os.path.exists("media"):
            os.mkdir('media')

    def test_create_officer_history(self):
        officer = OfficerFactory(officer_first='Jeffery', officer_last='Aaron')
        management.call_command(
            'import_star_data',
            file='common/tests/management/commands/Test-Data-Officers-Appt_date_and_stars.csv'
        )

        OfficerHistory.objects.filter(officer=officer).count().should.equal(2)
        OfficerBadgeNumber.objects.filter(officer=officer).count().should.equal(1)

    def test_new_officer_create(self):
        Officer.objects.filter(officer_first='Daniel', officer_last='Abate').exists().should.be.false
        management.call_command(
            'import_star_data',
            file='common/tests/management/commands/Test-Data-Officers-Appt_date_and_stars.csv'
        )
        Officer.objects.filter(officer_first='Daniel', officer_last='Abate').exists().should.be.true

    def test_multiple_officers_cannot_import(self):
        kwargs = {
            'officer_first': 'Kenneth',
            'officer_last': 'Abels',
            'gender': None,
            'race': None,
            'appt_date': None,
            'unit': None
        }
        OfficerFactory(**kwargs)
        officer = OfficerFactory(**kwargs)
        management.call_command(
            'import_star_data',
            file='common/tests/management/commands/Test-Data-Officers-Appt_date_and_stars.csv'
        )
        OfficerHistory.objects.filter(officer=officer).count().should.equal(0)
