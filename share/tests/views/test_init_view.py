import json
from django.template.defaultfilters import slugify

from common.tests.core import SimpleTestCase
from share.factories import SessionFactory
from share.models import Session


class InitViewTestCase(SimpleTestCase):
    def test_init_session(self):
        response = self.client.get('/share/init/')
        response.status_code.should.equal(200)

        data = json.loads(response.content.decode())
        data.should.contain('session')

    def test_save_session_filter(self):
        response = self.client.get('/share/init/')
        data = json.loads(response.content.decode())
        hash_id = data['session']['hash_id']
        title = "A super title"
        title_slug = slugify(title)
        query = {
            'something': ['1', '2'],
            'title': title
        }
        response = self.client.post('/%s/%s' % (hash_id, title_slug),
                                    content_type='application/json', data=json.dumps(query))
        response.status_code.should.equal(200)

        session_id = Session.id_from_hash(hash_id=hash_id)[0]
        session = Session.objects.get(pk=session_id)
        dict(session.query).should.equal(query)

    def test_non_creator_save_session_fail(self):
        hash_id = SessionFactory().hash_id
        response = self.client.post('/%s/' % hash_id)

        response.status_code.should.equal(404)

