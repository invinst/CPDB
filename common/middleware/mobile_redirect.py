from django.conf import settings
from django.http import HttpResponseRedirect


# We need to pull this middleware here since it's old and is not maintained anymore, so we need to take care
# it ourselfves. Please note that this middleware is not exactly the same to its published one.
class BrowscapParser(object):
    DEFAULT_UA_STRINGS = (
        'Android',
        'BlackBerry',
        'IEMobile',
        'Maemo',
        'Opera Mini',
        'SymbianOS',
        'WebOS',
        'Windows Phone',
        'iPhone',
        'iPod',
    )

    def __init__(self):
        self._cache = {}

    def detect_mobile(self, user_agent):
        try:
            return self._cache[user_agent]
        except KeyError:
            for lookup in BrowscapParser.DEFAULT_UA_STRINGS:
                if lookup in user_agent:
                    self._cache[user_agent] = True
                    break
            else:
                self._cache[user_agent] = False
        return self._cache[user_agent]


browser = BrowscapParser()


class MobileRedirectMiddleware(object):
    def process_request(self, request):
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        is_mobile = browser.detect_mobile(user_agent)

        request.is_mobile = is_mobile

        request_host = request.META.get('HTTP_HOST', '')
        if is_mobile and request_host != settings.SITE_INFO['mobile_host']:
            jump_url = "http://%s%s" % (settings.SITE_INFO['mobile_host'], request.path)
            return HttpResponseRedirect(jump_url)
