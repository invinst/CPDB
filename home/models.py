from __future__ import unicode_literals

from django.db import models

from wagtail.wagtailcore.models import Page
from wagtail.wagtailcore.fields import RichTextField, StreamField
from wagtail.wagtailadmin.edit_handlers import FieldPanel, StreamFieldPanel
from wagtail.wagtailcore import blocks
from wagtail.wagtailimages.blocks import ImageChooserBlock


class HomePage(Page):
    body = StreamField([
        ('half_paragraph', blocks.RichTextBlock(classname='col-md-6')),
        ('full_paragraph', blocks.RichTextBlock(classname='col-md-12')),
    ], blank=True)

    api_fields = ('body',)
    content_panels = Page.content_panels + [
        StreamFieldPanel('body'),
    ]
