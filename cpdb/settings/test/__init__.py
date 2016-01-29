SITE_INFO = {
    'domain': 'lvh.me:8081',
    'mobile_host': 'm.lvh.me:8081',
}

CELERY_ALWAYS_EAGER = True

HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'search.search_backends.CustomElasticSearchEngine',
        'URL': 'http://127.0.0.1:9200/',
        'INDEX_NAME': 'test_suggestion',
    },
}
