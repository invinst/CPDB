from django.template.defaultfilters import slugify

from allegation.factories import OfficerFactory, AllegationFactory
from common.tests.core import SimpleTestCase
from mobile.services.mobile_data_tool_service import DesktopToMobileRedirectorService



class MobileDataToolServiceTest(SimpleTestCase):
    def call_mobile_data_tool_service_with_hash_id(self, filters):
        return DesktopToMobileRedirectorService().perform(filters=filters)

    def test_redirect_to_officer_page(self):
        officer = OfficerFactory()
        expected_url_part = '/mobile/officer/{officer_name}/{officer_id}'.format(
                officer_name=slugify(officer.display_name),
                officer_id=officer.id
        )

        filters = {
            'officer': {
                'value': [officer.id]
            }
        }

        direct_url = self.call_mobile_data_tool_service_with_hash_id(filters=filters)
        direct_url.should.contain(expected_url_part)

    def test_redirect_to_complaint_page(self):
        allegation = AllegationFactory()
        expected_url_part = '/mobile/complaint/{crid}'.format(crid=allegation.crid)

        filters = {
            'allegation__crid': {
                'value': [allegation.crid]
            }
        }

        direct_url = self.call_mobile_data_tool_service_with_hash_id(filters=filters)
        direct_url.should.contain(expected_url_part)

    def test_redirect_to_not_exist_officer_page(self):
        fake_officer_id = 123
        filters = {
            'officer': {
                'value': [fake_officer_id]
            }
        }
        direct_url = self.call_mobile_data_tool_service_with_hash_id(filters=filters)
        direct_url.should.equal([])

    def test_redirect_officer_page_by_officer_badge(self):
        officer = OfficerFactory(star=123)
        expected_url_part = '/mobile/officer/{officer_name}/{officer_id}'.format(
                officer_name=slugify(officer.display_name),
                officer_id=officer.id
        )

        filters = {
            'officer__star': {
                'value': [officer.star]
            }
        }
        direct_url = self.call_mobile_data_tool_service_with_hash_id(filters=filters)
        direct_url.should.equal([expected_url_part])
