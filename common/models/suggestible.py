from django.core.urlresolvers import reverse
from django.db import models


class MobileSuggestible(object):
    def get_mobile_url(self):
        raise NotImplemented

    def as_suggestion_entry(self):
        raise NotImplemented


class MobileSuggestibleOfficer(MobileSuggestible):
    def get_mobile_url(self):
        return '{base_url}officer/{display_name}/{id}'.format(base_url=reverse('mobile:home'),
                                                              display_name=self.display_name,
                                                              id=self.id)

    def as_suggestion_entry(self):
        return {
            'text': self.display_name,
            'resource': 'officer',
            'url': self.get_mobile_url(),
            'resource_key': self.pk
        }


class MobileSuggestibleAllegation(MobileSuggestible):
    def get_mobile_url(self):
        return '{base_url}complaint/{crid}'.format(base_url=reverse('mobile:home'), crid=self.crid)

    def as_suggestion_entry(self):
        return {
            'text': self.crid,
            'resource': 'allegation',
            'url': self.get_mobile_url(),
            'resource_key': self.crid
        }
