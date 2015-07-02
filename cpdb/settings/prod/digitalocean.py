import dj_database_url

from cpdb.settings.base import *


DEBUG = os.environ.get('DEBUG') == 'True'

ALLOWED_HOSTS = ['*']

ADMINS = (('Bang', 'daotranbang@gmail.com'), ('Giang', 'giang271291@gmail.com'))

EMAIL_HOST = os.environ.get('POSTMARK_SMTP_SERVER')
EMAIL_HOST_PASSWORD = os.environ.get('POSTMARK_API_TOKEN')
EMAIL_HOST_USER = os.environ.get('POSTMARK_API_KEY')
EMAIL_PORT = 587

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'cpdb',
        'USER': os.environ.get('DB_HOST'),
        ***REMOVED***
        'PASSWORD': os.environ.get('DB_PASS'),
        'HOST': os.environ.get('DB_HOST'),
    }
}

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
        'LOCATION': '/var/tmp/django_cache',
        'TIMEOUT': (86400 * 30 * 6),
    }
}
