from django.db import models


class Alias(models.Model):
    alias = models.CharField(max_length=254)
    target = models.CharField(max_length=254)
    num_suggestions = models.IntegerField(default=0)
    num_usage = models.IntegerField(default=0)

    class Meta:
        unique_together = (('alias', 'target'),)
