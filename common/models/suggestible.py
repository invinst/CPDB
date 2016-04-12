class MobileSuggestible(object):
    def as_suggestion_entry(self):
        raise NotImplementedError


class MobileSuggestibleOfficer(MobileSuggestible):
    def as_suggestion_entry(self):
        return {
            'text': self.display_name,
            'resource': 'officer',
            'resource_key': self.pk,
            'meta': {
                'officer': self
            }
        }


class MobileSuggestibleAllegation(MobileSuggestible):
    def as_suggestion_entry(self):
        return {
            'text': self.crid,
            'resource': 'officer_allegation',
            'resource_key': self.crid,
            'meta': {
                'allegation': self
            }
        }
