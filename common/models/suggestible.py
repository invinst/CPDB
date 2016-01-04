from django.template.defaultfilters import slugify


class MobileSuggestible(object):
    def get_mobile_url(self):
        raise NotImplementedError

    def as_suggestion_entry(self):
        raise NotImplementedError


class MobileSuggestibleOfficer(MobileSuggestible):
    def get_mobile_url(self):
        slugified_display_name = slugify(self.display_name)
        return '/officer/{display_name}/{id}'.format(
            display_name=slugified_display_name, id=self.id)

    def as_suggestion_entry(self):
        return {
            'text': self.display_name,
            'resource': 'officer',
            'url': self.get_mobile_url(),
            'resource_key': self.pk
        }


class MobileSuggestibleAllegation(MobileSuggestible):
    def get_mobile_url(self):
        return '/complaint/{crid}'.format(crid=self.crid)

    def as_suggestion_entry(self):
        return {
            'text': self.crid,
            'resource': 'allegation',
            'url': self.get_mobile_url(),
            'resource_key': self.crid
        }
