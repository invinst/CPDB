from search.services.suggest.suggest_incident_date import SuggestTimeOfDay
from search.tests.services.suggest.base_test_suggest import BaseSuggestTestCase


class SuggestIncidentDateTestCase(BaseSuggestTestCase):
    def test_time_of_day(self):
        for term in ['mor', 'mid', 'after', 'eve', 'nig']:
            SuggestTimeOfDay.query(term).should.contain('Incident Time of Day')
