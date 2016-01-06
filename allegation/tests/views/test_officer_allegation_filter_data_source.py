import datetime

from allegation.factories import AllegationFactory, OfficerAllegationFactory
from allegation.tests.views.test_officer_allegation_api_view import \
    OfficerAllegationFilterMixin
from allegation.utils.date import generate_random_date
from common.constants import (
    DATE_ONLY_FORMAT, FOIA_START_DATE, START_UNIX_TIME_DATE)
from common.models import Allegation
from common.tests.core import SimpleTestCase


class OfficerAllegationFilterDataSource(
        OfficerAllegationFilterMixin, SimpleTestCase):
    def setUp(self):
        Allegation.objects.all().delete()
        today = datetime.datetime.now().strftime(DATE_ONLY_FORMAT)
        self.foia = AllegationFactory(
            incident_date=generate_random_date(FOIA_START_DATE, today))
        OfficerAllegationFactory(allegation=self.foia)
        self.pre_foia = AllegationFactory(
            incident_date=generate_random_date(
                START_UNIX_TIME_DATE, FOIA_START_DATE))
        OfficerAllegationFactory(allegation=self.pre_foia)

    def test_filter_by_data_source(self):
        data = self.fetch_officer_allegations(data_source='FOIA')
        len(data).should.equal(1)
        data[0]['allegation']['crid'].should.equal(str(self.foia.crid))

        data = self.fetch_officer_allegations(data_source='pre-FOIA')
        len(data).should.equal(1)
        data[0]['allegation']['crid'].should.equal(str(self.pre_foia.crid))

    def test_filter_by_all_data_source(self):
        data = self.fetch_officer_allegations(data_source=['FOIA', 'pre-FOIA'])
        len(data).should.equal(2)
