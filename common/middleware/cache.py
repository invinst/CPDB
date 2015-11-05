from collections import OrderedDict
import hashlib
from django.core.cache import CacheHandler, DEFAULT_CACHE_ALIAS
from django.middleware.cache import UpdateCacheMiddleware, FetchFromCacheMiddleware
from django.utils.cache import patch_response_headers, get_max_age, has_vary_header, _generate_cache_header_key, \
    _i18n_cache_key_suffix, cc_delim_re
from django.conf import settings
from django.utils.decorators import decorator_from_middleware_with_args
from django.utils.encoding import force_bytes

caches = CacheHandler()


def _generate_orderless_cache_url(request):
    sorted_keys = [k for k in sorted(request.GET.keys(), key=lambda k: k)]
    sorted_arr = OrderedDict()
    sorted_query_string = "{path}?".format(path=request.path_info)
    ampersand = ""
    counter = 0
    for key in sorted_keys:
        sorted_arr[key] = [v for v in sorted(request.GET.getlist(key))]

        for value in sorted_arr[key]:
            if counter > 0:
                ampersand = "&"

            sorted_query_string += "{ampersand}{key}={value}".format(ampersand=ampersand, key=key, value=value)
            counter += 1
    return sorted_query_string


def _generate_orderless_cache_key(request, method, headerlist, key_prefix):
    """Returns a cache key from the headers given in the header list."""
    ctx = hashlib.md5()
    for header in headerlist:
        value = request.META.get(header, None)
        if value is not None:
            ctx.update(force_bytes(value))
    url = hashlib.md5(force_bytes(_generate_orderless_cache_url(request)))
    cache_key = 'views.decorators.cache.cache_page.%s.%s.%s.%s' % (
        key_prefix, method, url.hexdigest(), ctx.hexdigest())
    print(cache_key)
    return _i18n_cache_key_suffix(request, cache_key)


def get_orderless_cache_key(request, key_prefix=None, method='GET', cache=None):
    if key_prefix is None:
        key_prefix = settings.CACHE_MIDDLEWARE_KEY_PREFIX
    cache_key = _generate_cache_header_key(key_prefix, request)
    if cache is None:
        cache = caches[settings.CACHE_MIDDLEWARE_ALIAS]
    headerlist = cache.get(cache_key, None)
    if headerlist is not None:
        return _generate_orderless_cache_key(request, method, headerlist, key_prefix)
    else:
        return None


class OrderlessUpdateCacheMiddleware(UpdateCacheMiddleware):
    def process_response(self, request, response):
        """Sets the cache, if needed."""
        if not self._should_update_cache(request, response):
            # We don't need to update the cache, just return.
            return response

        if response.streaming or response.status_code != 200:
            return response

        # Don't cache responses that set a user-specific (and maybe security
        # sensitive) cookie in response to a cookie-less request.
        if not request.COOKIES and response.cookies and has_vary_header(response, 'Cookie'):
            return response

        # Try to get the timeout from the "max-age" section of the "Cache-
        # Control" header before reverting to using the default cache_timeout
        # length.
        timeout = get_max_age(response)
        if timeout is None:
            timeout = self.cache_timeout
        elif timeout == 0:
            # max-age was set to 0, don't bother caching.
            return response
        patch_response_headers(response, timeout)
        if timeout:
            cache_key = learn_orderless_cache_key(request, response, timeout, self.key_prefix, cache=self.cache)
            if hasattr(response, 'render') and callable(response.render):
                response.add_post_render_callback(
                    lambda r: self.cache.set(cache_key, r, timeout)
                )
            else:
                self.cache.set(cache_key, response, timeout)
        return response


class OrderlessFetchFromCacheMiddleware(FetchFromCacheMiddleware):
    def process_request(self, request):
        """
        Checks whether the page is already cached and returns the cached
        version if available.
        """
        if request.method not in ('GET', 'HEAD'):
            request._cache_update_cache = False
            return None  # Don't bother checking the cache.

        # try and get the cached GET response
        cache_key = get_orderless_cache_key(request, self.key_prefix, 'GET', cache=self.cache)
        if cache_key is None:
            request._cache_update_cache = True
            return None  # No cache information available, need to rebuild.
        response = self.cache.get(cache_key, None)
        # if it wasn't found and we are looking for a HEAD, try looking just for that
        if response is None and request.method == 'HEAD':
            cache_key = get_orderless_cache_key(request, self.key_prefix, 'HEAD', cache=self.cache)
            response = self.cache.get(cache_key, None)

        if response is None:
            request._cache_update_cache = True
            return None  # No cache information available, need to rebuild.

        # hit, return cached response
        request._cache_update_cache = False
        return response


class OrderlessCacheMiddleware(OrderlessUpdateCacheMiddleware, OrderlessFetchFromCacheMiddleware):
    """
    Cache middleware that provides basic behavior for many simple sites.

    Also used as the hook point for the cache decorator, which is generated
    using the decorator-from-middleware utility.
    """
    def __init__(self, cache_timeout=None, **kwargs):
        # We need to differentiate between "provided, but using default value",
        # and "not provided". If the value is provided using a default, then
        # we fall back to system defaults. If it is not provided at all,
        # we need to use middleware defaults.

        try:
            key_prefix = kwargs['key_prefix']
            if key_prefix is None:
                key_prefix = ''
        except KeyError:
            key_prefix = settings.CACHE_MIDDLEWARE_KEY_PREFIX
        self.key_prefix = key_prefix

        try:
            cache_alias = kwargs['cache_alias']
            if cache_alias is None:
                cache_alias = DEFAULT_CACHE_ALIAS
        except KeyError:
            cache_alias = settings.CACHE_MIDDLEWARE_ALIAS
        self.cache_alias = cache_alias

        if cache_timeout is None:
            cache_timeout = settings.CACHE_MIDDLEWARE_SECONDS
        self.cache_timeout = cache_timeout
        self.cache = caches[self.cache_alias]


def orderless_cache_page(*args, **kwargs):
    """
    Decorator for views that tries getting the page from the cache and
    populates the cache if the page isn't in the cache yet.

    The cache is keyed by the URL and some data from the headers.
    Additionally there is the key prefix that is used to distinguish different
    cache areas in a multi-site setup. You could use the
    get_current_site().domain, for example, as that is unique across a Django
    project.

    Additionally, all headers from the response's Vary header will be taken
    into account on caching -- just like the middleware does.
    """
    # We also add some asserts to give better error messages in case people are
    # using other ways to call cache_page that no longer work.
    if len(args) != 1 or callable(args[0]):
        raise TypeError("cache_page has a single mandatory positional argument: timeout")
    cache_timeout = args[0]
    cache_alias = kwargs.pop('cache', None)
    key_prefix = kwargs.pop('key_prefix', None)
    if kwargs:
        raise TypeError("cache_page has two optional keyword arguments: cache and key_prefix")

    return decorator_from_middleware_with_args(OrderlessCacheMiddleware)(
        cache_timeout=cache_timeout, cache_alias=cache_alias, key_prefix=key_prefix
    )


def learn_orderless_cache_key(request, response, cache_timeout=None, key_prefix=None, cache=None):
    """
    Learns what headers to take into account for some request URL from the
    response object. It stores those headers in a global URL registry so that
    later access to that URL will know what headers to take into account
    without building the response object itself. The headers are named in the
    Vary header of the response, but we want to prevent response generation.

    The list of headers to use for cache key generation is stored in the same
    cache as the pages themselves. If the cache ages some data out of the
    cache, this just means that we have to build the response once to get at
    the Vary header and so at the list of headers to use for the cache key.
    """
    if key_prefix is None:
        key_prefix = settings.CACHE_MIDDLEWARE_KEY_PREFIX
    if cache_timeout is None:
        cache_timeout = settings.CACHE_MIDDLEWARE_SECONDS
    cache_key = _generate_cache_header_key(key_prefix, request)
    if cache is None:
        cache = caches[settings.CACHE_MIDDLEWARE_ALIAS]
    if response.has_header('Vary'):
        is_accept_language_redundant = settings.USE_I18N or settings.USE_L10N
        # If i18n or l10n are used, the generated cache key will be suffixed
        # with the current locale. Adding the raw value of Accept-Language is
        # redundant in that case and would result in storing the same content
        # under multiple keys in the cache. See #18191 for details.
        headerlist = []
        for header in cc_delim_re.split(response['Vary']):
            header = header.upper().replace('-', '_')
            if header == 'ACCEPT_LANGUAGE' and is_accept_language_redundant:
                continue
            headerlist.append('HTTP_' + header)
        headerlist.sort()
        cache.set(cache_key, headerlist, cache_timeout)
        return _generate_orderless_cache_key(request, request.method, headerlist, key_prefix)
    else:
        # if there is no Vary header, we still need a cache key
        # for the request.build_absolute_uri()
        cache.set(cache_key, [], cache_timeout)
        return _generate_orderless_cache_key(request, request.method, [], key_prefix)