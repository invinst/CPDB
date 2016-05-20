from cpdb.settings.base import *  # NOQA


DEBUG = True
ALLOWED_HOSTS = ['*']

TEMPLATES[0]['DIRS'] = ['templates']
TEMPLATES[0]['APP_DIRS'] = False
TEMPLATES[0]['OPTIONS']['loaders'] = [
    'django.template.loaders.filesystem.Loader',
    'cpdb.loaders.BlackListAppDirectoriesLoader']

TEMPLATE_APP_DIRS_BLACK_LIST = [
    'allegation',
    'common',
    'dashboard',
    'mobile'
]

ADMINS = (('Bang', 'daotranbang@gmail.com'), ('Giang', 'giang271291@gmail.com'))

EMAIL_BACKEND = 'django.core.mail.backends.filebased.EmailBackend'
EMAIL_FILE_PATH = '/tmp/cpdb-staging-email'

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'cpdb_staging',
        'USER': 'deploy',
        'PORT': '***REMOVED***',
        'PASSWORD': '',
        'HOST': '',
    }
}

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache'
    },
}

BROKER_URL = os.environ.get('BROKER_URL', '***REMOVED***')
DOMAIN = 'http://staging.cpdb.co'
CDN_URL = 'staging.cpdb.co'

SUBDOMAIN_URLCONFS = {
    None: 'cpdb.urls',
    'ms': 'mobile.urls',
}

SITE_INFO = {
    'domain': 'cpdb.co',
    'mobile_host': 'ms.cpdb.co',
}

HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'search.search_backends.CustomElasticSearchEngine',
        'URL': 'http://127.0.0.1:9200/',
        'INDEX_NAME': 'test_suggestion',
    },
}
