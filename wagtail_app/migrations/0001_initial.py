# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import modelcluster.fields
import wagtail.wagtailcore.fields
import wagtail.wagtailcore.blocks


class Migration(migrations.Migration):

    dependencies = [
        ('wagtailcore', '__latest__'),
    ]

    operations = [
        migrations.CreateModel(
            name='GlossaryPage',
            fields=[
                ('page_ptr', models.OneToOneField(serialize=False, auto_created=True, to='wagtailcore.Page', primary_key=True, parent_link=True)),
                ('subtitle', models.CharField(max_length=255)),
            ],
            options={
                'abstract': False,
            },
            bases=('wagtailcore.page',),
        ),
        migrations.CreateModel(
            name='GlossaryTableRows',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('sort_order', models.IntegerField(editable=False, null=True, blank=True)),
                ('term', models.CharField(max_length=255)),
                ('definition', models.TextField()),
                ('category', models.CharField(max_length=255, choices=[('n_a', 'n/a'), ('outcomes', 'Outcomes'), ('organizational', 'Organizational'), ('complaint_process', 'Complaint Process')])),
                ('page', modelcluster.fields.ParentalKey(related_name='glossary_table_rows', to='wagtail_app.GlossaryPage')),
            ],
            options={
                'abstract': False,
                'ordering': ['sort_order'],
            },
        ),
        migrations.CreateModel(
            name='HomePage',
            fields=[
                ('page_ptr', models.OneToOneField(serialize=False, auto_created=True, to='wagtailcore.Page', primary_key=True, parent_link=True)),
                ('body', wagtail.wagtailcore.fields.StreamField((('row_section', wagtail.wagtailcore.blocks.StreamBlock((('half_paragraph', wagtail.wagtailcore.blocks.RichTextBlock()), ('full_paragraph', wagtail.wagtailcore.blocks.RichTextBlock())))),), blank=True)),
            ],
            options={
                'abstract': False,
            },
            bases=('wagtailcore.page',),
        ),
    ]
