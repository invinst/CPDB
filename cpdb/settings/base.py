# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os

from django.core.urlresolvers import reverse_lazy

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', '***REMOVED***')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['*']

# Application definition
DJANGO_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.gis',
    'django.contrib.sites',
)

THIRD_PARTY_APPS = (
    'wagtail.contrib.wagtailapi',
    'django_extensions',
    'djangobower',
    'django_tables2',
    'rest_framework',
    'jsonify',
    'django_nose',
    'django_user_agents',
    'haystack',
    'taggit',
    'modelcluster',
    'wagtail.wagtailcore',
    'wagtail.wagtailadmin',
    'wagtail.wagtaildocs',
    'wagtail.wagtailsnippets',
    'wagtail.wagtailusers',
    'wagtail.wagtailimages',
    'wagtail.wagtailembeds',
    'wagtail.wagtailsearch',
    'wagtail.wagtailsites',
    'wagtail.wagtailredirects',
    'wagtail.wagtailforms',
    'wagtail.contrib.wagtailsearchpromotions',
)

CPDB_APPS = (
    'wagtail_app',
    'common',
    'allegation',
    'officer',
    'corsheaders',
    'search',
    'graph',
    'document',
    'share',
    'embed',
    'dashboard',
    'api',
    'mobile',
    'twitterbot',
)

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + CPDB_APPS

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'common.middleware.subdomain.SubdomainURLRoutingMiddleware',
    'common.middleware.mobile_redirect.MobileRedirectMiddleware',
    'common.middleware.user_agent.CrawlerDetector',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django_user_agents.middleware.UserAgentMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',

    'wagtail.wagtailcore.middleware.SiteMiddleware',
    'wagtail.wagtailredirects.middleware.RedirectMiddleware',
)

ROOT_URLCONF = 'cpdb.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.core.context_processors.request',
                'django.core.context_processors.media',

                'cpdb.context_precessors.env_settings',
            ],
        },
    },
]

WSGI_APPLICATION = 'cpdb.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': os.environ.get('DB_NAME', 'cpdb'),
        'USER': os.environ.get('DB_USER', 'eastagile'),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST': '127.0.0.1',
        'PORT': '***REMOVED***',
    }
}


# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/
LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'djangobower.finders.BowerFinder',
)

STATIC_URL = '/static/'

STATIC_ROOT = os.path.join(BASE_DIR, 'static')

AUTH_USER_MODEL = 'common.User'

BOWER_COMPONENTS_ROOT = BASE_DIR

BOWER_INSTALLED_APPS = (
    'bootstrap-toggle#2.2.0',
    'toastr#2.1.0',
    'bootstrap-material-design#0.3.0',
    'underscore#1.7.0',
    'jquery#2.1.3',
    'jquery-validation#1.13.1',
    'jquery-ui#1.11.3',
    'datatables-scroller#1.2.2',
    'datatables#1.10.7',
    'bootstrap#3.3.5',
    'bootstrap-tagsinput#0.4.2',
    'jquery.cookie#1.4.1',
    'c3',
    'components-font-awesome#4.4.0',
    'moment',
    'highcharts-release#4.1.10',
    'pluralize',
    'jqueryui-touch-punch#4bc0091452',
    'zeroclipboard',
    'jquery-countTo#1.1.0',
    'ratchet'
)

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR + '/media/'
CORS_ORIGIN_ALLOW_ALL = True

MAP_BOX_API_KEY = os.environ.get('MAP_BOX_API_KEY')

# FIXME: This should be move to constants.py instead
OFFICER_LIST_SEND_LENGTH = os.environ.get('OFFICER_LIST_SEND_LENGTH', 150)

# FIXME: This should be move to constants.py instead
ALLEGATION_LIST_ITEM_COUNT = 25

# FIXME: This should be move to constants.py instead
MAP_POINT_THRESHOLD = 3

CACHES = {
    'default': {
        'BACKEND': 'redis_cache.RedisCache',
        'LOCATION': 'redis://localhost:6379/0',
        'OPTIONS': {
            'MAX_ENTRIES': 20000
        }
    },
}

EMAIL_BACKEND = 'django.core.mail.backends.dummy.EmailBackend'

EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.mailgun.org'
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', 'request@foia.cpdb.co')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
EMAIL_PORT = 587
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

BROKER_URL = os.environ.get('BROKER_URL', 'redis://localhost:6379/0')

LOGIN_URL = reverse_lazy("admin:login")

ANALYTICS_API_KEY_FILE = os.path.join(BASE_DIR, 'keys', 'cpdb-analytics.p12')


# REST_FRAMEWORK
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    )
}

TEST_RUNNER = 'common.tests.runner.DjangoNoseTestSuiteRunner'

SITE_ID = 1

SUBDOMAIN_URLCONFS = {
    None: 'cpdb.urls',
    'm': 'mobile.urls',
}

# This should be override in corresponding settings
SITE_INFO = {
    'domain': 'cpdb.co',
    'mobile_host': 'm.cpdb.co',
}

# WAGTAIL
WAGTAIL_SITE_NAME = 'CPDB'

HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'search.search_backends.CustomElasticSearchEngine',
        'URL': 'http://127.0.0.1:9200/',
        'INDEX_NAME': 'suggestion',
    },
}

HAYSTACK_SIGNAL_PROCESSOR = 'haystack.signals.RealtimeSignalProcessor'

ELASTICSEARCH_SETTINGS = {
    'settings': {
        'number_of_shards': 1,
        'analysis': {
            'analyzer': {
                'ngram_analyzer': {
                    'type': 'custom',
                    'tokenizer': 'whitespace',
                    'filter': ['haystack_ngram', 'lowercase']
                },
                'edgengram_analyzer': {
                    'type': 'custom',
                    'tokenizer': 'standard',
                    'filter': ['lowercase', 'custom_delimiter', 'haystack_edgengram']
                }
            },
            'filter': {
                'haystack_ngram': {
                    'type': 'nGram',
                    'min_gram': 2,
                    'max_gram': 15
                },
                'haystack_edgengram': {
                    'type': 'edge_ngram',
                    'min_gram': 1,
                    'max_gram': 15
                },
                'custom_delimiter': {
                    'type': 'word_delimiter',
                    'preserve_original': True,
                    'stem_english_possessive': False
                }
            }
        }
    }
}

TWITTER_CONSUMER_KEY = os.environ.get('TWITTER_CONSUMER_KEY', '')
TWITTER_CONSUMER_SECRET = os.environ.get('TWITTER_CONSUMER_SECRET', '')
TWITTER_APP_TOKEN_KEY = os.environ.get('TWITTER_APP_TOKEN_KEY', '')
TWITTER_APP_TOKEN_SECRET = os.environ.get('TWITTER_APP_TOKEN_SECRET', '')
TWITTER_ENTITY_URL_BASE = 'https://cpdb.co'  # Temporary solution for getting domain name in twitterbot

DJANGO_ENV = 'prod'

DOCUMENT_CLOUD_USERNAME = os.environ.get('DOCUMENT_CLOUD_USERNAME')
DOCUMENT_CLOUD_PASSWORD = os.environ.get('DOCUMENT_CLOUD_PASSWORD')
