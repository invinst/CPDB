
from django.core.urlresolvers import reverse

from allegation.factories import AreaFactory
from common.models import Area
from common.tests.core import BaseLiveTestCase


class AllegationInitApiView(BaseLiveTestCase):
    def setUp(self):
        self.name = '1233'
        Area.objects.all().delete()
        self.area = AreaFactory(type='police-beats', name=self.name)

    def test_init_in_area(self):
        lng, lat = self.area.polygon.centroid

        url = "{url}?lat={lat}&lng={lng}".format(url=reverse('init'), lat=lat, lng=lng)
        self.visit(url)

        self.filter_tags().should.contain('police-beats')
        self.filter_tags().should.contain(self.name)

    def filter_tags(self):
        return self.find('#filter-tags').text