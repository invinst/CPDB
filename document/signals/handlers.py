from django.db.models.expressions import F
from django.utils import timezone

from django.db.models.signals import post_save
from django.dispatch.dispatcher import receiver

from document.models import Document, RequestEmail


@receiver(post_save, sender=RequestEmail, dispatch_uid='update_document_count')
def update_document_count(sender, instance, created, **kwargs):
    if created:
        Document.objects.filter(pk=instance.document_id).update(
            requested=True,
            number_of_request=F('number_of_request') + 1,
            last_requested=timezone.now()
        )
