import urllib

from django.test import SimpleTestCase

from allegation.factories import OfficerFactory, AllegationFactory
from common.models import Allegation
from common.models import Officer


class MobileSuggestionServiceTest(SimpleTestCase):
    def setUp(self):
        Allegation.objects.all().delete()
        Officer.objects.all().delete()

    def test_lookup_officer_by_name(self):
        officer = OfficerFactory()

        response = self.client.get('/lookup/{query}'.format(query=officer.officer_first))
        response.status_code.should.equals(302)
        expected_url = 'officer/{officer_name}/{officer_id}'.\
            format(officer_name=urllib.parse.quote(officer.display_name), officer_id=officer.pk)
        response.url.should.contain(expected_url)

    def test_lookup_by_officer_star(self):
        officer = OfficerFactory(star=123.456)

        response = self.client.get('/lookup/{query}'.format(query=officer.star))
        response.status_code.should.equals(302)
        expected_url = 'officer/{officer_name}/{officer_id}'.\
            format(officer_name=urllib.parse.quote(officer.display_name), officer_id=officer.pk)
        response.url.should.contain(expected_url)
