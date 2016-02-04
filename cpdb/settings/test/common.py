from cpdb.settings.base import *  # NOQA

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

CELERY_ALWAYS_EAGER = True

HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'search.search_backends.CustomElasticSearchEngine',
        'URL': 'http://127.0.0.1:9200/',
        'INDEX_NAME': 'test_suggestion',
    },
}

DOMAIN = 'http://lvh.me:8081'

DJANGO_LIVE_TEST_SERVER_ADDRESS = 'http://lvh.me:8081'

SITE_INFO = {
    'domain': 'lvh.me:8081',
    'mobile_host': 'm.lvh.me:8081',  # We use it in test env to make sure that we will never have any
}

DJANGO_ENV = 'test'
