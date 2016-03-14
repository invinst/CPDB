from django.utils import timezone
from django.db import models
from django.db.models.signals import post_save

from .document import Document  # NOQA


class RequestEmail(models.Model):
    crid = models.CharField(max_length=20)
    email = models.EmailField()
    session = models.ForeignKey('share.Session')
    document = models.ForeignKey(
        Document, on_delete=models.CASCADE, related_name='requestemails', null=True, default=None)

    class Meta:
        unique_together = (('document', 'email'),)


def update_allegations(sender, instance, created, **kwargs):
    if created:
        document = instance.document
        count = document.number_of_request
        document.number_of_request = count + 1
        document.requested = timezone.now()
        document.save()

post_save.connect(update_allegations, sender=RequestEmail)
