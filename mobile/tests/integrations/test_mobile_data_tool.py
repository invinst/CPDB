from django.core.urlresolvers import reverse

from allegation.factories import OfficerFactory
from common.tests.core import BaseLivePhoneTestCase
from share.factories import SessionFactory


class MobileDataToolTest(BaseLivePhoneTestCase):
    def enter_data_tool_url(self, hash_id):
        params = {
            'hash_id': hash_id,
            'slug': 'citizens-police-data-proj'
        }
        self.visit(reverse('mobile:data-tool', kwargs=params))

    def test_redirect_to_officer_page(self):
        officer = OfficerFactory()

        query = {
            'filters': {
                'officer': {
                    'value': [officer.id]
                }
            }
        }

        session = SessionFactory(query=query)
        self.enter_data_tool_url(hash_id=session.hash_id)

        self.should_see_text(officer.officer_first)
        self.should_see_text(officer.officer_last)
