import sys

from cpdb.settings.base import *


if 'test' in sys.argv:
    import sure

    (lambda n: n)(sure)  # ignore warning
    CELERY_ALWAYS_EAGER = True

MAP_BOX_API_KEY = 'sk.eyJ1Ijoic3RlZmFuZ2VvcmciLCJhIjoiMTNLSkhyTSJ9.b6k_KvDsuacf72UgbStcGQ'
ALLEGATION_LIST_ITEM_COUNT = 100
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
        'LOCATION': '/var/tmp/django_cache',
    }
}

if len(sys.argv) > 1 and sys.argv[1] == 'test':
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
        }
    }