from cpdb.settings.base import *  # NOQA


DJANGO_ENV = 'dev'

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
        'LOCATION': 'redis://localhost:6379/0',
        'OPTIONS': {
            'MAX_ENTRIES': 20000
        }
    },
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
                          'common.middleware.json_as_html.JsonAsHTML',) + MIDDLEWARE_CLASSES
    DEBUG_TOOLBAR_PATCH_SETTINGS = True

DOMAIN = 'http://localhost:8000'

# This should be override in corresponding settings
SITE_INFO = {
    'domain': 'lvh.me:8000',
    'mobile_host': 'm.lvh.me:8000',
}

USE_TZ = False

SHELL_PLUS = 'ipython'

DEBUG = True
