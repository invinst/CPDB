from django.db import models


class Alias(models.Model):
    alias = models.CharField(max_length=254)
    target = models.CharField(max_length=254)
