from django.db.models.signals import pre_save
from django.dispatch.dispatcher import receiver

from common.models import Allegation
from document.utils import send_document_notification_by_crid_and_link


@receiver(pre_save, sender=Allegation)
def check_document_update(**kwargs):
    instance = kwargs['instance']
    if instance.pk:

        if instance.document_id and instance.document_normalized_title:
            old_instance = Allegation.objects.get(pk=instance.pk)
            if instance.document_id == old_instance.document_id:
                return

            url = 'http://documentcloud.org/documents/{id}-{title}.html'\
                .format(
                    id=instance.document_id,
                    title=instance.document_normalized_title
                )
            send_document_notification_by_crid_and_link.delay(
                instance.crid,
                url
            )
            send_document_notification_by_crid_and_link.called = True
