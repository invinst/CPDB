from django.test.utils import override_settings
from django.core.urlresolvers import reverse

from common.tests.core import SimpleTestCase
from share.factories import SessionFactory


class HomePageTestCase(SimpleTestCase):
    @override_settings(DJANGO_ENV='dev')
    def test_google_analytic_script_on_dev(self):
        self.visit("/")
        self.find('#google-analytics').should.be.ok

    @override_settings(DJANGO_ENV='test')
    def test_no_google_analytic_script_on_test(self):
        self.visit("/")
        self.find_all('#google-analytics').should.be.empty

    def test_facebook_og_tags(self):
        session = SessionFactory()
        hash_id = session.hash_id
        slug = 'cpdb-data'
        self.visit(reverse('datatool', args=[hash_id, slug]))
        self.find('meta[property="og:title"]').attrs['content'].should.be.equal(session.title)
        (reverse('datatool', args=[hash_id, slug]) in self.find('meta[property="og:url"]').attrs['content'])\
            .should.be.true
        (reverse('allegation:sunburst-image', args=[hash_id]) in
         self.find('meta[property="og:image"]').attrs['content']).should.be.true
        self.find('meta[property="og:image:type"]').attrs['content'].should.be.equal('image/png')
