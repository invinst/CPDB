import datetime

from allegation.utils.date import tomorrow
from common.constants import DATE_ONLY_FORMAT
from common.tests.core import SimpleTestCase
from share.factories import SessionFactory
from share.models import Session


class NewSessionAnalyticsViewSetTestCase(SimpleTestCase):
    def setUp(self):
        self.login_user()

    def tearDown(self):
        Session.objects.all().delete()

    def get_new_sessions_analytics(self, params={}):
        response = self.client.get('/api/dashboard/new-sessions-analytics/', params)
        data = self.json(response)

        return response, data

    def test_should_return_status_200(self):
        SessionFactory()
        response, data = self.get_new_sessions_analytics()
        response.status_code.should.equal(200)
        data['results'][0].should.contain('created_date')
        data['results'][0].should.contain('count')

    def test_filtered_by_range(self):
        today = datetime.datetime.now()
        ten_days = datetime.timedelta(days=10)
        one_day = datetime.timedelta(days=1)

        end = tomorrow()
        begin = (today - one_day).strftime(DATE_ONLY_FORMAT)

        matched_session = SessionFactory(created_at=today)
        non_matched_session = SessionFactory(created_at=today - ten_days)

        params = {'begin': begin, 'end': end}
        response, data = self.get_new_sessions_analytics(params)
        response.status_code.should.equal(200)

        len(data['results']).should.be(1)
        data['results'][0]['created_date'].shouldnt.equal(non_matched_session.created_at.strftime(DATE_ONLY_FORMAT))
        data['results'][0]['created_date'].should.equal(matched_session.created_at.strftime(DATE_ONLY_FORMAT))
