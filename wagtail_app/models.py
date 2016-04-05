from __future__ import unicode_literals
import json

from django.db import models

from wagtail.wagtailcore.models import Page, Orderable
from wagtail.wagtailcore.fields import StreamField
from wagtail.wagtailadmin.edit_handlers import StreamFieldPanel, FieldPanel, FieldRowPanel, InlinePanel
from wagtail.wagtailcore import blocks
from wagtail.wagtailcore.rich_text import expand_db_html
from wagtail.wagtailsnippets.models import register_snippet
from modelcluster.fields import ParentalKey

from wagtail_app.serializers import GlossaryTableRowSerializer


@register_snippet
class GlossaryTableRow(models.Model):
    NA_CATEGORY = 'n_a'
    OUTCOMES_CATEGORY = 'outcomes'
    ORGANIZATIONAL_CATEGORY = 'organizational'
    COMPLAINT_PROCESS = 'complaint_process'
    CATEGORY_CHOICES = (
        (NA_CATEGORY, 'n/a'),
        (OUTCOMES_CATEGORY, 'Outcomes'),
        (ORGANIZATIONAL_CATEGORY, 'Organizational'),
        (COMPLAINT_PROCESS, 'Complaint Process')
        )

    term = models.CharField(max_length=255)
    definition = models.TextField()
    category = models.CharField(max_length=255, choices=CATEGORY_CHOICES)

    panels = [
        FieldRowPanel([
            FieldPanel('term'),
            FieldPanel('definition'),
            FieldPanel('category')
            ])
    ]

    @property
    def category_text(self):
        return dict(self.CATEGORY_CHOICES)[self.category]

    class Meta:
        abstract = True


class GlossaryTableRows(Orderable, GlossaryTableRow):
    page = ParentalKey('wagtail_app.GlossaryPage', related_name='glossary_table_rows')


class GlossaryPage(Page):
    subtitle = models.CharField(max_length=255)

    api_fields = ('serialized_glossary_rows', 'subtitle', 'slug')
    content_panels = Page.content_panels + [
        FieldPanel('subtitle'),
        InlinePanel('glossary_table_rows', label="Glossary Table Rows"),
    ]

    def serialized_glossary_rows(self):
        serializer = GlossaryTableRowSerializer(self.glossary_table_rows.all().order_by('sort_order'), many=True)
        return serializer.data


class HomePage(Page):
    body = StreamField([
        ('row_section', blocks.StreamBlock([
            ('half_paragraph', blocks.RichTextBlock()),
            ('full_paragraph', blocks.RichTextBlock()),
        ]))
        ], blank=True)

    api_fields = ('slug', 'extended_body')
    content_panels = Page.content_panels + [
        StreamFieldPanel('body'),
    ]

    def extended_body(self):
        body = json.loads(self.serializable_data()['body'])

        for row in body:
            if row['type'] == 'row_section':
                for paragraph in row['value']:
                    paragraph['value'] = expand_db_html(paragraph['value'])

        return body
