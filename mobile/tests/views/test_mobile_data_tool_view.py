from django.core.urlresolvers import reverse

from django.test import SimpleTestCase
from rest_framework.status import HTTP_301_MOVED_PERMANENTLY

from allegation.factories import OfficerFactory, AllegationFactory
from mobile.constants import DEFAULT_REDIRECT_URL
from mobile.utils.mobile_url_builder import MobileUrlBuilder
from share.factories import SessionFactory


class MobileDataToolViewTest(SimpleTestCase):
    def request_mobile_data_tool_page(self, hash_id):
        params = {
            'hash_id': hash_id,
            'slug': 'any-slug'
        }
        return self.client.get(reverse('mobile:data-tool', kwargs=params))

    def test_redirect_desktop_session_to_mobile_detail_page(self):
        officer = OfficerFactory()
        filters = {'officer': [{'value': officer.id, 'category': 'officer'}]}
        session = SessionFactory(query={'filters': filters})
        expected_url = MobileUrlBuilder().officer_page(officer)

        response = self.request_mobile_data_tool_page(hash_id=session.hash_id)

        response.status_code.should.equal(HTTP_301_MOVED_PERMANENTLY)
        response.url.should.contain(expected_url)

    def test_redirect_desktop_session_to_mobile_search_page(self):
        officer = OfficerFactory()
        allegation = AllegationFactory()
        filters = {
            'allegation__crid': [{'value': allegation.crid, 'category': 'allegation__crid'}],
            'officer': [{'value': officer.id, 'category': 'officer'}]
        }
        session = SessionFactory(query={'filters': filters})

        response = self.request_mobile_data_tool_page(hash_id=session.hash_id)

        response.status_code.should.equal(HTTP_301_MOVED_PERMANENTLY)
        response.url.should.contain(DEFAULT_REDIRECT_URL)

    def test_redirect_invalid_desktop_session_to_mobile_search_page(self):
        bad_hash_id = 'invalidsession'

        response = self.request_mobile_data_tool_page(hash_id=bad_hash_id)

        response.status_code.should.equal(HTTP_301_MOVED_PERMANENTLY)
        response.url.should.contain(DEFAULT_REDIRECT_URL)
