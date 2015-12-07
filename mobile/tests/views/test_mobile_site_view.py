from django.core.urlresolvers import reverse

from common.tests.core import SimpleTestCase


class MobileSiteViewTestCase(SimpleTestCase):
    def test_visit_mobile_view(self):
        self.visit(reverse('mobile:home'))
        self.response.status_code.should.equal(200)
        self.assertTemplateUsed(self.response, 'mobile/index.html')
