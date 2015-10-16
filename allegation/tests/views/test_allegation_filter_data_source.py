import datetime

from django.test import SimpleTestCase

from allegation.factories import AllegationFactory
from allegation.tests.views.test_allegation_api_view import AllegationFilterMixin
from allegation.utils.date import generate_random_date
from common.constants import DATE_ONLY_FORMAT, FOIA_START_DATE, START_UNIX_TIME_DATE
from common.models import Allegation


class AllegationFilterDataSource(AllegationFilterMixin, SimpleTestCase):
    def test_filter_by_data_source(self):
        Allegation.objects.all().delete()
        today = datetime.datetime.now().strftime(DATE_ONLY_FORMAT)
        foia = AllegationFactory(incident_date=generate_random_date(FOIA_START_DATE, today))
        pre_foia = AllegationFactory(incident_date=generate_random_date(START_UNIX_TIME_DATE, FOIA_START_DATE))

        data = self.fetch_allegations(data_source='FOIA')
        len(data).should.equal(1)
        data[0]['allegation']['crid'].should.equal(str(foia.crid))

        data = self.fetch_allegations(data_source='PRE FOIA')
        len(data).should.equal(1)
        data[0]['allegation']['crid'].should.equal(str(pre_foia.crid))