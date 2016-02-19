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


def get_or_set(key):
    def get_or_set_decorator(func):
        def func_wrapper():
            cache_value = cache.get(key)

            if cache_value:
                return cache_value
            else:
                value = func()
                cache.set(key, value)
                return value

        return func_wrapper
    return get_or_set_decorator
