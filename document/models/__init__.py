from django.utils import timezone
from django.db import models
from django.db.models.signals import post_save

from common.models import Allegation


class RequestEmail(models.Model):
    crid = models.CharField(max_length=20)
    email = models.EmailField()
    session = models.ForeignKey('share.Session')

    class Meta:
        unique_together = (('crid', 'email'),)


def update_allegations(sender, instance, created, **kwargs):
    if created:
        allegation = Allegation.objects.get(crid=instance.crid)
        count = allegation.number_of_request
        allegation.update(
            number_of_request=count+1, last_requested=timezone.now())

post_save.connect(update_allegations, sender=RequestEmail)
