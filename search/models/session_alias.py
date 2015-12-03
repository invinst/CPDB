from django.db import models
from django.utils.translation import ugettext_lazy as _

from share.models import Session


class SessionAlias(models.Model):
    alias = models.CharField(max_length=254)
    session = models.ForeignKey(Session)
    user = models.ForeignKey('common.User', default=1)

    class Meta:
        verbose_name_plural = _('aliases')
