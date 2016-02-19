from unittest.mock import MagicMock

from django.core.cache import cache
from django.test import override_settings

from common.tests.core import SimpleTestCase
from mobile.utils.cache_helper import CacheHelper, get_or_set


@override_settings(CACHES={
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
})
class CacheHelperTest(SimpleTestCase):
    def tearDown(self):
        cache.clear()

    def test_get_or_set_when_already_have_value(self):
        cache.set('cache_key', 'other_value')
        CacheHelper.get_or_set('cache_key', 'value')
        cache.get('cache_key').should.be.equal('other_value')

    def test_get_or_set_when_not_set_yet(self):
        CacheHelper.get_or_set('cache_key', 'value')
        cache.get('cache_key').should.be.equal('value')


@override_settings(CACHES={
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
})
class GetOrSetDecoratorTest(SimpleTestCase):
    def tearDown(self):
        cache.clear()

    def test_get_or_set_when_already_have_value(self):
        cache.set('cache_key', 'other_value')
        method = MagicMock(return_value='value')

        decorated_method = get_or_set('cache_key')(method)

        decorated_method().should.equal('other_value')

    def test_get_or_set_when_not_set_yet(self):
        method = MagicMock(return_value='value')

        decorated_method = get_or_set('cache_key')(method)

        decorated_method().should.equal('value')
