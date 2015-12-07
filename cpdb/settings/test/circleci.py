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
    'domain': 'cpdb.test:8000',
    'mobile_host': 'thisisadomainformobilesite',  # We use it in test env to make sure that we will never have any
                                                  # domain that match it
}
