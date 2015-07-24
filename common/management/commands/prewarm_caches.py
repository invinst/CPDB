import itertools
from itertools import chain
import urllib
from common.models import AllegationCategory
from django.conf import settings
from django.core.management.base import BaseCommand
from django.core.urlresolvers import reverse
from django.db.models import Count

class Command(BaseCommand):
    help = 'Run automatically in the background'

    def cache_searches(self):
        alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
                     'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        numbers = ["%d" % x for x in range(10)]

        keywords = chain(itertools.product(alphabets, repeat=2), itertools.product(numbers, repeat=2))

        for keyword in keywords:
            search_term = "".join(keyword)
            url = "%s%s?term=%s" % (settings.DOMAIN, reverse('search:suggest'), search_term)
            urllib.request.urlopen(url)

    def cache_allegations(self):
        apis = ['allegation-api', 'allegation-api-gis', 'allegation-api-summary', 'allegation-api-summary']
        for category in AllegationCategory.objects.distinct().values_list('category', flat=True):
            category = urllib.parse.quote(category)
            for api in apis:
                url = "%s%s?cat__category=%s" % (settings.DOMAIN, reverse('allegation:%s' % api), category)
                urllib.request.urlopen(url)

    def cache_home(self):
        apis = ['allegation-api', 'allegation-api-gis', 'allegation-api-summary', 'allegation-api-summary']
        for api in apis:
            url = "%s%s" % (settings.DOMAIN, reverse('allegation:%s' % api))
            urllib.request.urlopen(url)

    def handle(self, *args, **options):
        self.cache_home()
        self.cache_allegations()
        self.cache_searches()
