from cpdb.settings.base import *

DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'circle_test',
        'HOST': 'localhost',
        ***REMOVED***
        'USER': 'ubuntu',
        'TEST': {
            'NAME': 'circle_test',
        }
    }
}

CELERY_ALWAYS_EAGER = True

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

COMPRESS_ENABLED = False

# This should be override in corresponding settings
SITE_INFO = {
    'domain': 'lvh.me:8081',
    'mobile_host': 'm.lvh.me:8081',  # We use it in test env to make sure that we will never have any
                                    # domain that match it
}

HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'search.search_backends.CustomElasticSearchEngine',
        'URL': 'http://127.0.0.1:9200/',
        'INDEX_NAME': 'test_suggestion',
    },
}
