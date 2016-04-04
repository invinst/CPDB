from django.db import models

from common.constants import DOCUMENT_TYPES
from common.models import Allegation
from common.models.time_stamp import TimeStampedModel
from document.utils import send_document_notification


class Document(TimeStampedModel):
    DOCUMENTCLOUD_URL_TEMPLATE = 'http://documentcloud.org/documents/{documentcloud_id}-{normalized_title}.html'

    documentcloud_id = models.IntegerField(null=True, blank=True)
    normalized_title = models.CharField(max_length=255, null=True, blank=True)
    title = models.CharField(max_length=255, null=True, blank=True)
    requested = models.BooleanField(default=False)
    pending = models.BooleanField(default=False)
    number_of_request = models.IntegerField(default=0)
    last_requested = models.DateTimeField(null=True)
    type = models.CharField(max_length=10, choices=DOCUMENT_TYPES)

    allegation = models.ForeignKey(Allegation, on_delete=models.CASCADE, related_name='documents')

    @property
    def documentcloud_url(self):
        return self.DOCUMENTCLOUD_URL_TEMPLATE.format(
            documentcloud_id=self.documentcloud_id,
            normalized_title=self.normalized_title
        )

    def update(self, **kwargs):
        '''
        Use this method to update document instead of calling save
        '''
        send_email = False

        if 'documentcloud_id' in kwargs and int(kwargs['documentcloud_id']) > 0:
            kwargs.setdefault('requested', False)
            kwargs.setdefault('pending', False)

            send_email = int(kwargs['documentcloud_id']) != int(self.documentcloud_id or 0)
        elif 'pending' in kwargs and kwargs['pending'] is False:
            kwargs.setdefault('requested', True)
            kwargs.setdefault('documentcloud_id', 0)

        for key, value in kwargs.items():
            setattr(self, key, value)
        self.save()

        emails = self.requestemails.values_list('email', flat=True)

        if send_email:
            send_document_notification.delay(
                crid=self.allegation.crid,
                link=self.documentcloud_url,
                recipient_list=list(emails)
            )
            send_document_notification.called = True


class RequestEmail(models.Model):
    crid = models.CharField(max_length=20)
    email = models.EmailField()
    session = models.ForeignKey('share.Session')
    document = models.ForeignKey(
        Document, on_delete=models.CASCADE, related_name='requestemails', null=True, default=None)

    class Meta:
        unique_together = (('document', 'email'),)
