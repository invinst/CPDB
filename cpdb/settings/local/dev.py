import sys

from cpdb.settings.base import *


if 'test' in sys.argv:
    import sure

    (lambda n: n)(sure)  # ignore warning
    CELERY_ALWAYS_EAGER = True

MAP_BOX_API_KEY = 'sk.eyJ1Ijoic3RlZmFuZ2VvcmciLCJhIjoiMTNLSkhyTSJ9.b6k_KvDsuacf72UgbStcGQ'
ALLEGATION_LIST_ITEM_COUNT = 25
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
        'LOCATION': 'redis://localhost:6379/0',
        'OPTIONS': {
            'MAX_ENTRIES': 20000
        }
    },
}

if len(sys.argv) > 1 and sys.argv[1] == 'test':
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
        }
    }
COMPRESS_ENABLED = False


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
        },
    },
}

DEBUG_TOOLBAR_ENABLE = False


if DEBUG_TOOLBAR_ENABLE:
    INSTALLED_APPS += ('debug_toolbar',)
    MIDDLEWARE_CLASSES = ('debug_toolbar.middleware.DebugToolbarMiddleware',
                          'common.middleware.json_as_html.JsonAsHTML', ) + MIDDLEWARE_CLASSES

    DEBUG_TOOLBAR_PATCH_SETTINGS = True

DOMAIN = 'http://localhost:8000'

# This should be override in corresponding settings
SITE_INFO = {
    'domain': 'cpdb.dev:8000',
    'mobile_host': 'm.cpdb.dev:8000',
}
