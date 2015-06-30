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

        location = response['location']
        new_hash_id = location.split("/")[-2]
        new_session_id = Session.id_from_hash(new_hash_id)[0]
        new_session = Session.objects.get(pk=new_session_id)
        dict(new_session.query).should.equal(dict(session.query))

        response = self.client.get(location)
        response.status_code.should.equal(200)
        Session.objects.all().count().should.equal(session_count + 1)  # 0 new session created
