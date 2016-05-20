from cpdb.settings.test.common import *  # NOQA

DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'circle_test',
        'HOST': 'localhost',
        'PORT': '***REMOVED***',
        'USER': 'ubuntu',
        'TEST': {
            'NAME': 'circle_test',
        }
    }
}
