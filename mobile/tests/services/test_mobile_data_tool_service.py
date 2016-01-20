from django.template.defaultfilters import slugify

from allegation.factories import OfficerFactory, AllegationFactory
from common.tests.core import SimpleTestCase
from mobile.services.mobile_data_tool_service import MobileDataToolService
from share.factories import SessionFactory


class MobileDataToolServiceTest(SimpleTestCase):
    def call_mobile_data_tool_service_with_hash_id(self, hash_id):
        data_tool_service = MobileDataToolService(hash_id=hash_id)
        return data_tool_service.get_redirect_url()

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
        direct_url = self.call_mobile_data_tool_service_with_hash_id(hash_id=session.hash_id)
        direct_url.should.contain(expected_url_part)

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
        direct_url = self.call_mobile_data_tool_service_with_hash_id(hash_id=session.hash_id)
        direct_url.should.contain(expected_url_part)

    def test_redirect_to_not_exist_officer_page(self):
        expected_url_part = '/mobile'
        fake_officer_id = 123
        query = {
            'filters': {
                'officer': {
                    'value': [fake_officer_id]
                }
            }
        }
        session = SessionFactory(query=query)
        direct_url = self.call_mobile_data_tool_service_with_hash_id(hash_id=session.hash_id)
        direct_url.should.contain(expected_url_part)

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
        direct_url = self.call_mobile_data_tool_service_with_hash_id(hash_id=session.hash_id)
        direct_url.should.contain(expected_url_part)
