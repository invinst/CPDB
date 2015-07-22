from django.db import models


class QuerySetManager(models.Manager):
    def get_queryset(self):
        raise NotImplementedError

    def __getattr__(self, attr, *args):
        try:
            return getattr(self.__class__, attr, *args)
        except AttributeError:
            return getattr(self.get_queryset(), attr, *args)
