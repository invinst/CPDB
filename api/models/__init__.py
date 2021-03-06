from django.db import models

from common.constants import (
    DEFAULT_SITE_TITLE, DEFAULT_META_DESCRIPTION, DEFAULT_META_KEYWORDS, DEFAULT_EXCEL_EXPORT_DISCLAIMER)
from officer.models import Story


def _default_story_types_order():
    return ",".join(Story.objects.all().values_list('story_type', flat=True).distinct())


class Setting(models.Model):
    default_site_title = models.CharField(max_length=255, default=DEFAULT_SITE_TITLE)
    story_types_order = models.TextField(default=_default_story_types_order)
    requested_document_email_subject = models.CharField(max_length=255, blank=True, null=True)
    requested_document_email_text = models.TextField(blank=True, null=True)
    meta_description = models.CharField(max_length=255, default=DEFAULT_META_DESCRIPTION)
    meta_keywords = models.CharField(max_length=255, default=DEFAULT_META_KEYWORDS)
    export_excel_disclaimer = models.TextField(blank=True, default=DEFAULT_EXCEL_EXPORT_DISCLAIMER)

    DEFAULT_SITE_TITLE = DEFAULT_SITE_TITLE


class InterfaceText(models.Model):
    key = models.SlugField()
    text = models.TextField()
