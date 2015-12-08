from django.test import RequestFactory, TestCase, override_settings
from common.middleware.subdomain import SubdomainMiddleware, SubdomainURLRoutingMiddleware


class SubdomainTestMixin(object):
    DOMAIN = 'example.com'
    URL_MODULE_PATH = 'subdomains.tests.urls'

    def get_host_for_subdomain(self, subdomain=None):
        if subdomain is not None:
            host = '%s.%s' % (subdomain, self.DOMAIN)
        else:
            host = '%s' % self.DOMAIN
        return host

    @override_settings(
        DEFAULT_URL_SCHEME='http',
        ROOT_URLCONF='%s.application' % URL_MODULE_PATH,
        SUBDOMAIN_URLCONFS={
            None: 'marketing',
            'api': 'api',
            'www': 'marketing',
        },
        SITE_INFO={
            'domain': DOMAIN
        },
        MIDDLEWARE_CLASSES=(
            'django.middleware.common.CommonMiddleware',
            'subdomains.middleware.SubdomainURLRoutingMiddleware',
        )
    )
    def run(self, *args, **kwargs):
        super(SubdomainTestMixin, self).run(*args, **kwargs)


class SubdomainMiddlewareTest(SubdomainTestMixin,TestCase):
    def setUp(self):
        self.middleware = SubdomainMiddleware()

    def get_host_for_subdomain(self, subdomain=None):
        if subdomain is not None:
            host = '%s.%s' % (subdomain, self.DOMAIN)
        else:
            host = '%s' % self.DOMAIN
        return host

    def test_good_subdomain(self):
        subdomain = 'api'
        request = RequestFactory().get('/', HTTP_HOST=self.get_host_for_subdomain(subdomain))
        self.middleware.process_request(request)
        request.subdomain.should.be.equal(subdomain)

    def test_non_matched_subdomain(self):
        subdomain = 'non-matched.xyz.abc'
        request = RequestFactory().get('/', HTTP_HOST=subdomain)
        self.middleware.process_request(request)
        request.subdomain.should.be.equal(None)


class SubdomainURLRoutingMiddlewareTest(SubdomainTestMixin,TestCase):
    def setUp(self):
        self.middleware = SubdomainURLRoutingMiddleware()

    def get_path_to_urlconf(self, name):
        return '.'.join((self.URL_MODULE_PATH, name))

    def test_url_routing(self):
        subdomain = 'api'
        host = self.get_host_for_subdomain(subdomain)
        request = RequestFactory().get('/', HTTP_HOST=host)
        self.middleware.process_request(request)
        request.urlconf.should.be.equal('api')
