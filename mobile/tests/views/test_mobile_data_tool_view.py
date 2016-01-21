from django.core.urlresolvers import reverse

from django.test import SimpleTestCase
from rest_framework.status import HTTP_301_MOVED_PERMANENTLY
from django.template.defaultfilters import slugify

from allegation.factories import OfficerFactory, AllegationFactory
from share.factories import SessionFactory


class MobileDataToolViewTest(SimpleTestCase):
    def call_mobile_data_tool_view_with_hash_id(self, hash_id):
        params = {
            'hash_id': hash_id,
            'slug': 'citizens-police-data-proj'
        }
        return self.client.get(reverse('mobile:data-tool', kwargs=params))

    def test_redirect_to_officer_page(self):
        officer = OfficerFactory()
        expected_url_part = '/officer/{officer_name}/{officer_id}'.format(
            officer_name=slugify(officer.display_name),
            officer_id=officer.id
        )

        query = {
            'filters': {
                'officer': {
                    'value': [officer.id]
                }
            }
        }

        session = SessionFactory(query=query)
        response = self.call_mobile_data_tool_view_with_hash_id(hash_id=session.hash_id)
        response.status_code.should.equal(HTTP_301_MOVED_PERMANENTLY)
        response.url.should.contain(expected_url_part)

    def test_redirect_to_complaint_page(self):
        allegation = AllegationFactory()
        expected_url_part = '/complaint/{crid}'.format(crid=allegation.crid)

        query = {
            'filters': {
                'allegation__crid': {
                    'value': [allegation.crid]
                }
            }
        }

        session = SessionFactory(query=query)
        response = self.call_mobile_data_tool_view_with_hash_id(hash_id=session.hash_id)
        response.status_code.should.equal(HTTP_301_MOVED_PERMANENTLY)
        response.url.should.contain(expected_url_part)

    def test_redirect_to_not_exist_officer_page(self):
        fake_officer_id = 123
        query = {
            'filters': {
                'officer': {
                    'value': [fake_officer_id]
                }
            }
        }
        session = SessionFactory(query=query)
        response = self.call_mobile_data_tool_view_with_hash_id(hash_id=session.hash_id)
        response.status_code.should.equal(HTTP_301_MOVED_PERMANENTLY)

    def test_redirect_officer_page_by_officer_badge(self):
        officer = OfficerFactory(star=123)
        expected_url_part = '/officer/{officer_name}/{officer_id}'.format(
            officer_name=slugify(officer.display_name),
            officer_id=officer.id
        )

        query = {
            'filters': {
                'officer__star': {
                    'value': [officer.star]
                }
            }
        }
        session = SessionFactory(query=query)
        response = self.call_mobile_data_tool_view_with_hash_id(hash_id=session.hash_id)
        response.status_code.should.equal(HTTP_301_MOVED_PERMANENTLY)
        response.url.should.contain(expected_url_part)
