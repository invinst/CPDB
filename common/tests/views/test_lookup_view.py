import urllib

from django.test import SimpleTestCase
from rest_framework.status import HTTP_301_MOVED_PERMANENTLY

from allegation.factories import OfficerFactory, AllegationFactory
from common.models import Allegation
from common.models import Officer


class LookupViewTest(SimpleTestCase):
    def setUp(self):
        Allegation.objects.all().delete()
        Officer.objects.all().delete()

    def test_lookup_officer_by_name(self):
        officer = OfficerFactory()

        response = self.client.get('/lookup/{query}'.format(query=officer.officer_first))
        response.status_code.should.equals(HTTP_301_MOVED_PERMANENTLY)
        expected_url = 'officer/{officer_name}/{officer_id}'.\
            format(officer_name=urllib.parse.quote(officer.display_name), officer_id=officer.pk)
        response.url.should.contain(expected_url)

    def test_lookup_by_officer_star(self):
        officer = OfficerFactory(star=123456)

        response = self.client.get('/lookup/{query}'.format(query=officer.star))
        response.status_code.should.equals(HTTP_301_MOVED_PERMANENTLY)
        expected_url = 'officer/{officer_name}/{officer_id}'.\
            format(officer_name=urllib.parse.quote(officer.display_name), officer_id=officer.pk)
        response.url.should.contain(expected_url)

    def test_lookup_by_allegation_crid(self):
        allegation = AllegationFactory()
        response = self.client.get('/lookup/{query}'.format(query=allegation.crid))
        response.status_code.should.equals(HTTP_301_MOVED_PERMANENTLY)
        expected_url = 'complaint/{crid}'.format(crid=allegation.crid)
        response.url.should.contain(expected_url)

    def test_lookup_not_found(self):
        bad_query = 'bad_query'

        response = self.client.get('/lookup/{query}'.format(query=bad_query))
        response.status_code.should.equals(HTTP_301_MOVED_PERMANENTLY)

        expected_url = 'search/{query}'.format(query=bad_query)
        response.url.should.contain(expected_url)
