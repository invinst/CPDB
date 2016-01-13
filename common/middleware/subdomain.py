import logging
import operator
import re

from django.conf import settings
from django.utils.cache import patch_vary_headers

logger = logging.getLogger(__name__)
lower = operator.methodcaller('lower')

UNSET = object()


def get_domain():
    if getattr(settings, 'SITE_INFO', False):
        return settings.SITE_INFO['domain']
    else:
        return ''


# We need to pull this middleware here since it's old and is not maintained anymore, so we need to take care
# it ourselfves. Please note that this middleware is not exactly the same to its published one.
class SubdomainMiddleware(object):
    def get_domain_for_request(self, request):
        return get_domain()

    def process_request(self, request):
        domain, host = map(lower,
                           (self.get_domain_for_request(request), request.get_host()))
        pattern = r'^(?:(?P<subdomain>.*?)\.)?%s(?::.*)?$' % re.escape(domain)
        matches = re.match(pattern, host)

        if matches:
            request.subdomain = matches.group('subdomain')
        else:
            request.subdomain = None
            logger.warning('The host %s does not belong to the domain %s, '
                           'unable to identify the subdomain for this request',
                           request.get_host(), domain)


class SubdomainURLRoutingMiddleware(SubdomainMiddleware):
    def process_request(self, request):
        super(SubdomainURLRoutingMiddleware, self).process_request(request)

        subdomain = getattr(request, 'subdomain', UNSET)

        if subdomain is not UNSET:
            urlconf = settings.SUBDOMAIN_URLCONFS.get(subdomain)
            if urlconf is not None:
                logger.debug("Using urlconf %s for subdomain: %s",
                             repr(urlconf), repr(subdomain))
                request.urlconf = urlconf

    def process_response(self, request, response):
        if getattr(settings, 'FORCE_VARY_ON_HOST', True):
            patch_vary_headers(response, ('Host',))

        return response
