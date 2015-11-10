import urllib
import string

from itertools import chain, product

from django.conf import settings
from django.core.management.base import BaseCommand
from django.core.urlresolvers import reverse

from common.models import AllegationCategory

CACHE_APIS = [
    'allegation-api',
    'allegation-api-clusters',
    'allegation-api-summary',
    'allegation-race-gender-api',
    'allegation-api-analysis',
    'allegation-api-chart',
    'allegation-api-officers',
    'allegation-api-sunburst'
]

class Command(BaseCommand):
    help = 'Run automatically in the background'

    def cache_searches(self):
        alphabets = list(string.ascii_lowercase)
        numbers = ["%d" % x for x in range(10)]

        keywords = chain(product(alphabets, repeat=2), product(numbers, repeat=2))

        for keyword in keywords:
            search_term = "".join(keyword)
            url = "%s%s?term=%s" % (settings.DOMAIN, reverse('search:suggest'), search_term)
            urllib.request.urlopen(url)

    def cache_allegations(self):
        for category in AllegationCategory.objects.distinct().values_list('category', flat=True):
            category = urllib.parse.quote(category)
            for api in CACHE_APIS :
                url = "%s%s?cat__category=%s" % (settings.DOMAIN, reverse('allegation:%s' % api), category)
                urllib.request.urlopen(url)

    def cache_home(self):
        for api in CACHE_APIS + ['area-api']:
            url = "%s%s" % (settings.DOMAIN, reverse('allegation:%s' % api))
            urllib.request.urlopen(url)

    def handle(self, *args, **options):
        self.cache_home()
        self.cache_allegations()
        self.cache_searches()
