from __future__ import unicode_literals
import json

from django.db import models

from wagtail.wagtailcore.models import Page
from wagtail.wagtailcore.fields import RichTextField, StreamField
from wagtail.wagtailadmin.edit_handlers import FieldPanel, StreamFieldPanel
from wagtail.wagtailcore import blocks
from wagtail.wagtailimages.blocks import ImageChooserBlock
from wagtail.wagtailcore.rich_text import expand_db_html


class HomePage(Page):
    body = StreamField([
        ('row_section', blocks.StreamBlock([
            ('half_paragraph', blocks.RichTextBlock()),
            ('full_paragraph', blocks.RichTextBlock()),
        ])
    )], blank=True)

    api_fields = ('slug', 'extended_body')
    content_panels = Page.content_panels + [
        StreamFieldPanel('body'),
    ]

    def extended_body(self):
        body = json.loads(self.serializable_data()['body'])
        for row in body:
            for paragraph in row['value']:
                paragraph['value'] = expand_db_html(paragraph['value'])

        return body
