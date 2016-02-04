from django.db import models

from allegation.models.query import NullsLastQuery


class NullsLastQuerySet(models.query.QuerySet):
    def __init__(self, model=None, query=None, using=None, hints=None):
        super(NullsLastQuerySet, self).__init__(model, query, using, hints)
        self.query = query or NullsLastQuery(self.model)


class AllegationQuerySet(NullsLastQuerySet):
    def update(self, *args, **kwargs):
        if 'document_id' in kwargs and int(kwargs['document_id']) > 0:
            kwargs.setdefault('document_requested', False)
            kwargs.setdefault('document_pending', False)
        elif 'document_pending' in kwargs and \
                kwargs['document_pending'] is False:
            kwargs.setdefault('document_requested', True)
            kwargs.setdefault('document_id', 0)

        return super(AllegationQuerySet, self).update(*args, **kwargs)


class OfficerAllegationQuerySet(NullsLastQuerySet):
    pass
