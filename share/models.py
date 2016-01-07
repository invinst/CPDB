from django.utils import timezone
from django.db import models
from django.template.defaultfilters import slugify
from django_extensions.db.fields.json import JSONField

from common.models import Officer, AllegationCategory, Investigator, Area
from common.models import (
    GENDER_DICT, FINDINGS_DICT, OUTCOMES_DICT, CUSTOM_FILTER_DICT,
    HAS_FILTERS_DICT)
from common.utils.hashid import hash_obj
from search.models import SuggestionLog, FilterLog
from search.services import REPEATER_DESC


KEYS = {
    'officer': Officer,
    'cat': AllegationCategory,
    'allegation__investigator': Investigator
}

OTHER_KEYS = {
    'officer__gender': GENDER_DICT,
    'complainant_gender': GENDER_DICT,
    'final_outcome': OUTCOMES_DICT,
    'final_finding': FINDINGS_DICT,
    'has_filters': HAS_FILTERS_DICT
}


class Session(models.Model):
    title = models.CharField(max_length=255, blank=True)
    query = JSONField(blank=True)
    active_tab = models.CharField(max_length=40, default='', blank=True)
    sunburst_arc = models.CharField(max_length=40, default='', blank=True)
    share_from = models.ForeignKey('share.Session', null=True, default=None, blank=True)
    share_count = models.IntegerField(default=0, blank=True)
    created_at = models.DateTimeField(default=timezone.now, null=True, blank=True)
    ip = models.CharField(default='', max_length=40, null=True, blank=True) # we could handle IPv6 as well
    user_agent = models.CharField(max_length=255, null=True, blank=True)

    @property
    def hash_id(self):
        return hash_obj.encode(self.id)

    def get_suggestion_logs(self):
        suggestion_logs = SuggestionLog.objects.filter(session_id=self.hash_id)

        return suggestion_logs

    def get_filter_logs(self):
        filter_logs = FilterLog.objects.filter(session_id=self.hash_id)
        return filter_logs

    @staticmethod
    def id_from_hash(hash_id):
        return hash_obj.decode(hash_id)

    @staticmethod
    def parse_hash_from_link(link):
        return link.split('/')[4]

    def get_absolute_url(self):
        return '/data/{hash}/{slug}'.format(
            hash=self.hash_id,
            slug=slugify(self.title)
        )

    def clone(self):
        session = Session()
        session.title = self.title
        session.query = self.query
        session.sunburst_arc = self.sunburst_arc
        session.active_tab = self.active_tab
        session.share_from = self
        session.save()
        return session

    @property
    def readable_query(self):
        filters = self.query.get('filters', {})
        results = {}
        for key in filters:
            values = self.get_filter_values(key, filters[key])
            if values:
                results[key] = values
        return results

    def __str__(self):
        return self.title or self.hash_id

    @staticmethod
    def get_filter_values(key, values):
        if key == 'allegation__areas__id':
            ret = []
            for pk in values['value']:
                area = Area.objects.get(pk=pk)
                ret.append({'text': "%s: %s" % (area.type, area.name), 'value': pk})
            return ret

        if key in KEYS:
            values = KEYS[key].objects.filter(pk__in=values['value'])
            return [o.tag_value for o in values]

        if key in OTHER_KEYS:
            return [{
                'text': OTHER_KEYS[key].get(o),
                'value': o,
            } for o in values['value']]

        if key in CUSTOM_FILTER_DICT:
            return [{
                'text': CUSTOM_FILTER_DICT[key][o]['text'],
                'value': o,
            } for o in values['value']]
        if key == 'officer__officerallegations_count__gt':
            value = values['value'][0]
            return [{'text': REPEATER_DESC[str(value)], 'value': value}]

        return [{'value': x, 'text': x} for x in values['value']]

    @property
    def query_string(self):
        filters = self.query.get('filters', {})
        query = []
        for key in filters:
            value = filters[key]['value']
            query.append("&".join("{key}={value}".format(key=key, value=v) for v in value))
        return "&".join(query)

