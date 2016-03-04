from cpdb.settings.prod.common import *  # NOQA


ALLOWED_HOSTS = ['*']

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'cpdb',
        'USER': os.environ.get('DB_USER'),
        ***REMOVED***
        'PASSWORD': os.environ.get('DB_PASS'),
        'HOST': os.environ.get('DB_HOST'),
    }
}

CACHES = {
    'default': {
        'BACKEND': 'redis_cache.RedisCache',
        'LOCATION': '***REMOVED***',
        'OPTIONS': {
            'MAX_ENTRIES': 20000
        }
    },
}
