from django.conf import settings
from django.core.urlresolvers import reverse
from django.db import models
from django.template.defaultfilters import slugify
from django_extensions.db.fields.json import JSONField
from hashids import Hashids
from common.models import Officer, AllegationCategory, Investigator, GENDER_DICT, OUTCOME_TEXT_DICT, \
    FINAL_FINDING_TEXT_DICT,Area

hash_obj = Hashids(settings.SECRET_KEY, min_length=6)

KEYS = {
    'officer': Officer,
    'cat': AllegationCategory,
    'investigator': Investigator
}
OTHER_KEYS = {
    'officer__gender': GENDER_DICT,
    'complainant_gender': GENDER_DICT,
    'outcome_text': OUTCOME_TEXT_DICT,
    'final_finding_text': FINAL_FINDING_TEXT_DICT,
}


class Session(models.Model):
    title = models.CharField(max_length=255)
    query = JSONField()
    share_from = models.ForeignKey('share.Session', null=True, default=None)
    share_count = models.IntegerField(default=0)

    @property
    def hash_id(self):
        return hash_obj.encode(self.id)

    @staticmethod
    def id_from_hash(hash_id):
        return hash_obj.decode(hash_id)

    def get_absolute_url(self):
        kw = {'hash_id': self.hash_id}
        if self.title:
            kw['slugified_url'] = slugify(self.title)

        return reverse('homepage-share', kwargs=kw)

    def clone(self):
        session = Session()
        session.title = self.title
        session.query = self.query
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

    @staticmethod
    def get_filter_values(key, values):
        if key == 'areas__id':
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

        return values['value']
