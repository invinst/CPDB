from cpdb.settings.base import *


DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'circle_test',
        'HOST': 'localhost',
        ***REMOVED***
        'USER': 'ubuntu',
        'TEST': {
            'NAME': 'circle_test',
        }
    }
}

CELERY_ALWAYS_EAGER = True

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

COMPRESS_ENABLED = False

# This should be override in corresponding settings
SITE_INFO = {
    'domain': 'cpdb.test:8000',
    'mobile_host': 'm.cpdb.local',  # We use it in test env to make sure that we will never have any
                                    # domain that match it
}

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
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

HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'search.search_backends.CustomElasticSearchEngine',
        'URL': 'http://127.0.0.1:9200/',
        'INDEX_NAME': 'test_suggestion',
    },
}
