from django.test.utils import override_settings

from common.tests.core import SimpleTestCase


class HomePageTestCase(SimpleTestCase):
    @override_settings(DJANGO_ENV='dev')
    def test_google_analytic_script_on_dev(self):
        self.visit("/")
        self.find('#google-analytics').should.be.ok

    @override_settings(DJANGO_ENV='test')
    def test_no_google_analytic_script_on_test(self):
        self.visit("/")
        self.find_all('#google-analytics').should.be.empty
