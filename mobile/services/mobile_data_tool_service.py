from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q

from common.models import Officer, Allegation
from share.models import Session


class MobileDataToolService(object):
    # FIXME: put this in to constants.py
    DEFAULT_REDIRECT_URL = '/mobile'

    def __init__(self, hash_id=''):
        self.hash_id = hash_id

        try:
            session_id = Session.id_from_hash(hash_id)[0]
            session = Session.objects.get(id=session_id)
            self.filters = session.query.get('filters', {})
        except (IndexError, Session.DoesNotExist):
            self.filters = {}

    def get_model_map(self, value):
        return {
            'officer__star': {
                'model': Officer,
                'query': Q(star=value)
            },
            'officer': {
                'model': Officer,
                'query': Q(pk=value)
            },
            'allegation__crid': {
                'model': Allegation,
                'query': Q(crid=value)
            }
        }

    def filter_values(self, k, vs):
        return [(k, v) for v in vs]

    def fetch_filters(self):
        results = []
        for k in self.filters:
            results.extend(self.filter_values(k, self.filters[k]['value']))
        return results

    def get_redirect_url(self):
        filters = self.fetch_filters()
        if len(filters) != 1:
            return self.DEFAULT_REDIRECT_URL

        filter, value = filters[0]

        try:
            model_map = self.get_model_map(value)[filter]
            model_object = model_map['model'].objects.get(model_map['query'])
        except ObjectDoesNotExist:
            return self.DEFAULT_REDIRECT_URL

        return self.DEFAULT_REDIRECT_URL + model_object.get_mobile_url()
