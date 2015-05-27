import sure

from cpdb.settings.base import *


DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'circle_test',
        'HOST': 'localhost',
        ***REMOVED***
        'USER': 'ubuntu',
        'TEST_NAME': 'circle_test',
    }
}

CELERY_ALWAYS_EAGER = True

CACHES = {

}