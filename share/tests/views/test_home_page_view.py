from common.tests.core import SimpleTestCase
from share.factories import SessionFactory
from share.models import Session


class HomepageViewTestCase(SimpleTestCase):

    def test_home_page_generate_new_share_when_access_a_share(self):
        session = SessionFactory()
        session_count = Session.objects.all().count()

        response = self.client.get("/%s/" % session.hash_id)
        response.status_code.should.equal(302)
        Session.objects.all().count().should.equal(session_count + 1)  # 1 new session created

        response = self.client.get(response['location'])
        response.status_code.should.equal(200)
        Session.objects.all().count().should.equal(session_count + 1)  # 0 new session created
