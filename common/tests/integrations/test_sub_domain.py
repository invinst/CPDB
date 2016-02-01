from django.test import RequestFactory, TestCase, override_settings
from common.middleware.subdomain import SubdomainMiddleware, SubdomainURLRoutingMiddleware, get_domain


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


class SubdomainMiddlewareTest(SubdomainTestMixin, TestCase):
    def setUp(self):
        self.middleware = SubdomainMiddleware()

    def get_subdomain_after_middleware_process(self, subdomain):
        request = RequestFactory().get('/', HTTP_HOST=subdomain)
        self.middleware.process_request(request)
        return request.subdomain

    def test_good_subdomain(self):
        subdomain = self.get_host_for_subdomain('api')
        self.get_subdomain_after_middleware_process(subdomain).should.equal('api')

    def test_non_matched_subdomain(self):
        subdomain = 'non-matched.xyz.abc'
        self.get_subdomain_after_middleware_process(subdomain).should.equal(None)

    def test_none_subdomain(self):
        subdomain = self.get_host_for_subdomain(None)
        self.get_subdomain_after_middleware_process(subdomain).should.equal(None)


class SubdomainURLRoutingMiddlewareTest(SubdomainTestMixin, TestCase):
    def setUp(self):
        self.middleware = SubdomainURLRoutingMiddleware()

    def test_url_routing(self):
        host = self.get_host_for_subdomain('api')
        request = RequestFactory().get('/', HTTP_HOST=host)
        self.middleware.process_request(request)
        request.urlconf.should.be.equal('api')


class SubdomainUtilityTest(SubdomainTestMixin, TestCase):
    @override_settings(
        SITE_INFO={
            'domain': 'domain'
        },
    )
    def test_get_domain(self):
        get_domain().should.equal('domain')

    @override_settings(
        SITE_INFO={}
    )
    def test_get_domain_without_site_domain_setting(self):
        get_domain().should.equal('')
