from django.db.models import Count

from common.models import Officer
from mobile.utils.cache_helper import get_or_set
from mobile.utils.collection_helper import safe_get


class OfficerDistributionService(object):
    @staticmethod
    def calculate_distribution():
        allegations_count_distribution = list(Officer.objects.exclude(allegations_count=0).
                                              values_list('allegations_count').
                                              annotate(num=Count('allegations_count')).
                                              order_by('allegations_count'))
        max_allegations_count = safe_get(allegations_count_distribution, -1, (0, 0))[0]

        results = [0] * max_allegations_count

        for item in allegations_count_distribution:
            allegations_count, num_allegations_count = item
            results[allegations_count - 1] = num_allegations_count

        return results

    @staticmethod
    @get_or_set('distribution')
    def get_distribution():
        return OfficerDistributionService.calculate_distribution()
