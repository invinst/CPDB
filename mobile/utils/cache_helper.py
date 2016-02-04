from django.core.cache import cache


class CacheHelper(object):
    @staticmethod
    def get_or_set(key, value):
        cache_value = cache.get(key)
        if cache_value:
            return cache_value
        else:
            cache.set(key, value)
            return value
