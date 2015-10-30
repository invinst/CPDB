from django.template.defaultfilters import slugify
from common.tests.core import SimpleTestCase, BaseLiveTestCase
from share.factories import SessionFactory
from share.models import Session


class HomepageViewTestCase(BaseLiveTestCase):

    def test_home_page_generate_new_share_when_access_a_share(self):
        session = SessionFactory()
        session_count = Session.objects.all().count()
        title_slug = slugify(session.title)

        response = self.visit("/#!/data-tools/%s/%s" % (session.hash_id, title_slug))
        Session.objects.all().count().should.equal(session_count + 1)  # 1 new session created

        location = self.browser.current_url
        new_hash_id = location.split("/")[-2]
        new_session_id = Session.id_from_hash(new_hash_id)[0]
        new_session = Session.objects.get(pk=new_session_id)
        dict(self.compact(new_session.query)).should.equal(self.compact(dict(session.query)))

        response = self.client.get(location)
        response.status_code.should.equal(200)
        Session.objects.all().count().should.equal(session_count + 1)  # 0 new session created

    def compact(self, dct):
        return dict((k[0], k[1]) for k in dct.items() if k[1])
