# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os, sys

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

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.gis',
    'django.contrib.sites',

    'django_extensions',
    'djangobower',
    'django_tables2',
    'compressor',
    'rest_framework',
    'jsonify',
    'django_nose',
    'django_user_agents',
    'haystack',

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
    'mobile'
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'common.middleware.subdomain.SubdomainURLRoutingMiddleware',
    'common.middleware.mobile_redirect.MobileRedirectMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django_user_agents.middleware.UserAgentMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',

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
        ***REMOVED***
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
    'compressor.finders.CompressorFinder',
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
OFFICER_LIST_SEND_LENGTH = os.environ.get('OFFICER_LIST_SEND_LENGTH', 150)

CACHES = {
    'default': {
        'BACKEND': 'redis_cache.RedisCache',
        'LOCATION': 'redis://localhost:6379/0',
        'OPTIONS': {
            'MAX_ENTRIES': 20000
        }
    },
}

GRAPH_DISTCURVE_NUM_X_TICKS = 6
GRAPH_DISTCURVE_NUM_Y_TICKS = 4
MAP_POINT_THRESHOLD = 3
SHELL_PLUS ='ipython'
DJANGO_ENV = 'dev'


EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.mailgun.org'
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', 'request@foia.cpdb.co')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
EMAIL_PORT = 587
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

BROKER_URL = os.environ.get('BROKER_URL', 'redis://localhost:6379/0')
COMPRESS_PRECOMPILERS = (
    ('text/less', 'lessc {infile}'),
    ('text/sass', 'sass {infile}'),
)

LOGIN_URL = reverse_lazy("admin:login")

ANALYTICS_API_KEY_FILE = os.path.join(BASE_DIR, 'keys', 'cpdb-analytics.p12')


# REST_FRAMEWORK
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 20,
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
                    'tokenizer': 'whitespace',
                    'filter': ['haystack_edgengram', 'lowercase']
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
                    'min_gram': 2,
                    'max_gram': 15
                }
            }
        }
    }
}

DJANGO_ENV = 'dev'
