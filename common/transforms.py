from django.db import models
from django.db.models import IntegerField


class HourExtract(models.Transform):
    lookup_name = 'hour'

    def as_sql(self, compiler, connection):
        lhs_sql, lhs_params = compiler.compile(self.lhs)
        return "EXTRACT(hour FROM %s)" % lhs_sql, lhs_params

    @property
    def output_field(self):
        return IntegerField()

models.DateTimeField.register_lookup(HourExtract)
