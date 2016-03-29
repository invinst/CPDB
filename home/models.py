from __future__ import unicode_literals
import json

from wagtail.wagtailcore.models import Page
from wagtail.wagtailcore.fields import StreamField
from wagtail.wagtailadmin.edit_handlers import StreamFieldPanel
from wagtail.wagtailcore import blocks
from wagtail.wagtailcore.rich_text import expand_db_html


class HomePage(Page):
    body = StreamField([
        ('row_section', blocks.StreamBlock([
            ('half_paragraph', blocks.RichTextBlock()),
            ('full_paragraph', blocks.RichTextBlock()),
        ])),
        ('table_section', blocks.StreamBlock([
            ('glossary_table_row', blocks.StructBlock([
                ('term', blocks.CharBlock()),
                ('definition', blocks.TextBlock()),
                ('category', blocks.ChoiceBlock(choices=[
                    ('n_a', 'n/a'),
                    ('outcomes', 'Outcomes'),
                    ('organizational', 'Organizational'),
                    ('complaint-process', 'Complaint Process')
                    ]))
                ])),
            ('table_row', blocks.StreamBlock([
                ('table_text_cell', blocks.TextBlock()),
                ('table_char_cell', blocks.CharBlock())
                ])),
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
