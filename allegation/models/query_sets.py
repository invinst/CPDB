from django.db import models

from allegation.models.query import NullsLastQuery


class NullsLastQuerySet(models.query.QuerySet):
    def __init__(self, model=None, query=None, using=None, hints=None):
        super(NullsLastQuerySet, self).__init__(model, query, using, hints)
        self.query = query or NullsLastQuery(self.model)


class AllegationQuerySet(NullsLastQuerySet):
    pass


class OfficerAllegationQuerySet(NullsLastQuerySet):
    pass
