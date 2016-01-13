
from django.core.urlresolvers import reverse

from allegation.factories import AreaFactory
from common.tests.core import SimpleTestCase
from share.models import Session


class AllegationInitApiViewTestCase(SimpleTestCase):
    def setUp(self):
        self.name = '1233'
        self.area = AreaFactory(type='police-beats', name=self.name)

    def test_init_in_area(self):
        lng, lat = self.area.polygon.centroid

        self.visit(reverse('init'), {
            'lat': lat,
            'lng': lng,
        })

        self.response.status_code.should.equal(302)
        hash_id = self.response['location'].split('/')[-1]
        session_id = Session.id_from_hash(hash_id)[0]
        session = Session.objects.get(id=session_id)
        session.query['filters']['areas__id']['value']\
            .should.equal([self.area.id])

    def test_init_no_area(self):
        self.visit(reverse('init'), {
            'lat': -1,
            'lng': -1,
        })
        self.response.status_code.should.equal(302)
        self.response['location'].should.match(r'/data/$')
