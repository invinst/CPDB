from django.contrib.gis.db import models

from common.models import Allegation
from common.models.time_stamp import TimeStampedModel
from common.constants import DOCUMENT_TYPES


class Document(TimeStampedModel):
    documentcloud_id = models.IntegerField(null=True, blank=True)
    normalized_title = models.CharField(max_length=255, null=True, blank=True)
    title = models.CharField(max_length=255, null=True, blank=True)
    requested = models.BooleanField(default=False)
    pending = models.BooleanField(default=False)
    number_of_request = models.IntegerField(default=0)
    last_requested = models.DateTimeField(null=True)
    type = models.CharField(max_length=10, choices=DOCUMENT_TYPES)

    allegation = models.ForeignKey(Allegation, on_delete=models.CASCADE, related_name='documents')
