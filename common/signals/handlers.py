from django.db.models.signals import post_save
from django.dispatch.dispatcher import receiver

from common.constants import DOCUMENT_TYPES
from common.models import Allegation


@receiver(post_save, sender=Allegation, dispatch_uid='create_documents_for_allegation')
def create_documents_for_allegation(sender, instance, created, **kwargs):
    if created:
        for document_type in DOCUMENT_TYPES:
            instance.documents.get_or_create(type=document_type[0])
