import sure

from cpdb.settings.base import *


DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'circle_test',
        'HOST': 'localhost',
        ***REMOVED***
        'USER': 'ubuntu',
        'TEST_NAME': 'circle_test',
    }
}

CELERY_ALWAYS_EAGER = True
