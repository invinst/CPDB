from django.core.urlresolvers import reverse
from django.test import override_settings
from rest_framework.status import HTTP_301_MOVED_PERMANENTLY, HTTP_404_NOT_FOUND

from allegation.factories import AllegationCategoryFactory, OfficerAllegationFactory
from common.tests.core import SimpleTestCase
from common.utils.mobile_url_hash_util import MobileUrlHashUtil
from share.models import Session


@override_settings(DEBUG=True)
class AllegationViewTest(SimpleTestCase):
    def test_bad_complaint_page_crid(self):
        response = self.client.get(
            reverse('allegation:complaint-page',
                    kwargs={'crid': '123456', 'category_slug': 'slug', 'cat_hash': '12345678'}), follow=True)
        response.status_code.should.be.equal(HTTP_404_NOT_FOUND)

    def test_should_redirect_to_data_tool_page(self):
        previous_session_count = Session.objects.count()
        category = AllegationCategoryFactory()
        officer_allegation = OfficerAllegationFactory(cat=category)
        crid = officer_allegation.allegation.crid
        cat_hash = MobileUrlHashUtil().encode(category.id)

        response = self.client.get(reverse('allegation:complaint-page',
                                           kwargs={'crid': crid, 'category_slug': 'slug', 'cat_hash': cat_hash}))
        response.status_code.should.be.equal(HTTP_301_MOVED_PERMANENTLY)
        response.url.should.contain('/data')

        Session.objects.count().should.be(previous_session_count + 1)
        last_session = Session.objects.last()
        last_session.query['filters'].should.contain('cat')
        last_session.query['filters'].should.contain('allegation__crid')
