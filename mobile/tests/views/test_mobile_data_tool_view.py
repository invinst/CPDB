from django.core.urlresolvers import reverse

from django.test import SimpleTestCase
from rest_framework.status import HTTP_301_MOVED_PERMANENTLY

from allegation.factories import OfficerFactory, AllegationFactory
from mobile.constants import DEFAULT_REDIRECT_URL
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
        session = SessionFactory(query={'filters': {'officer': {'value': [officer.id]}}})
        expected_url = officer.get_mobile_url()

        response = self.request_mobile_data_tool_page(hash_id=session.hash_id)

        response.status_code.should.equal(HTTP_301_MOVED_PERMANENTLY)
        response.url.should.contain(expected_url)

    def test_redirect_desktop_session_to_mobile_search_page(self):
        officer = OfficerFactory()
        allegation = AllegationFactory()
        session = SessionFactory(query={'filters': {
            'officer': {'value': [officer.id]},
            'allegation__crid': {'value': [allegation.crid]}
        }})

        response = self.request_mobile_data_tool_page(hash_id=session.hash_id)

        response.status_code.should.equal(HTTP_301_MOVED_PERMANENTLY)
        response.url.should.contain(DEFAULT_REDIRECT_URL)

    def test_redirect_invalid_desktop_session_to_mobile_search_page(self):
        bad_hash_id = 'invalidsession'

        response = self.request_mobile_data_tool_page(hash_id=bad_hash_id)

        response.status_code.should.equal(HTTP_301_MOVED_PERMANENTLY)
        response.url.should.contain(DEFAULT_REDIRECT_URL)
