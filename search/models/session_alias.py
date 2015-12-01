from django.db import models

from share.models import Session


class SessionAlias(models.Model):
    alias = models.CharField(max_length=254)
    session = models.ForeignKey(Session)
