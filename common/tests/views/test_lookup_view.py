import urllib

from django.test import SimpleTestCase
from django.template.defaultfilters import slugify
from rest_framework.status import HTTP_301_MOVED_PERMANENTLY

from allegation.factories import (
    OfficerFactory, AllegationFactory, OfficerAllegationFactory)
from common.models import Allegation
from common.models import Officer


class LookupViewTest(SimpleTestCase):
    def setUp(self):
        Allegation.objects.all().delete()
        Officer.objects.all().delete()

    def test_lookup_officer_by_name(self):
        officer = OfficerFactory()

        response = self.client.get(
            '/lookup/{query}'.format(query=officer.officer_first))
        response.status_code.should.equals(HTTP_301_MOVED_PERMANENTLY)

        slugified_display_name = slugify(officer.display_name)
        expected_url = 'officer/{officer_name}/{officer_id}'.format(
            officer_name=urllib.parse.quote(slugified_display_name),
            officer_id=officer.pk)
        response.url.should.contain(expected_url)

    def test_lookup_by_officer_star(self):
        officer = OfficerFactory(star=123456)

        response = self.client.get(
            '/lookup/{query}'.format(query=officer.star))
        response.status_code.should.equals(HTTP_301_MOVED_PERMANENTLY)
        slugified_display_name = slugify(officer.display_name)

        expected_url = 'officer/{officer_name}/{officer_id}'.format(
            officer_name=urllib.parse.quote(slugified_display_name),
            officer_id=officer.pk)
        response.url.should.contain(expected_url)

    def test_lookup_by_allegation_crid(self):
        allegation = AllegationFactory()
        OfficerAllegationFactory(allegation=allegation)
        response = self.client.get('/lookup/{query}'.format(
            query=allegation.crid))
        response.status_code.should.equals(HTTP_301_MOVED_PERMANENTLY)
        expected_url = 'complaint/{crid}'.format(crid=allegation.crid)
        response.url.should.contain(expected_url)

    def test_lookup_not_found(self):
        bad_query = 'bad_query'

        response = self.client.get('/lookup/{query}'.format(query=bad_query))
        response.status_code.should.equals(HTTP_301_MOVED_PERMANENTLY)

        expected_uri = '/search/{query}'.format(query=bad_query)
        urllib.parse.urlparse(response.url).path.should.equal(expected_uri)

    def test_translate_underscore_officer_lookup_url(self):
        officer_first = 'First'
        officer_last = 'Last'
        officer = OfficerFactory(
            officer_first=officer_first, officer_last=officer_last)
        slugified_display_name = slugify(officer.display_name)
        expected_url = 'officer/{officer_name}/{officer_id}'.format(
            officer_name=urllib.parse.quote(slugified_display_name),
            officer_id=officer.pk)
        underscored_query = 'first_last'

        response = self.client.get(
            '/lookup/{query}'.format(query=underscored_query))
        response.status_code.should.equals(HTTP_301_MOVED_PERMANENTLY)

        response.url.should.contain(expected_url)
