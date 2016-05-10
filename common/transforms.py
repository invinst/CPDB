from django.db import models
from django.db.models import IntegerField


class HourExtract(models.Transform):
    lookup_name = 'hour'

    def as_sql(self, compiler, connection):
        lhs, params = compiler.compile(self.lhs)
        return "EXTRACT(hour FROM %s)" % lhs, params

    def relabeled_clone(self, relabels):
        return self.__class__(
            self.lhs.relabeled_clone(relabels),
            lookups=self.init_lookups
        )

    @property
    def output_field(self):
        return IntegerField()

models.DateTimeField.register_lookup(HourExtract)
