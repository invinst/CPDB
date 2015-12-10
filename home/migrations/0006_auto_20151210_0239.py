# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import wagtail.wagtailcore.fields
import wagtail.wagtailcore.blocks


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0005_auto_20151209_1031'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='homepage',
            name='stream_body',
        ),
        migrations.AlterField(
            model_name='homepage',
            name='body',
            field=wagtail.wagtailcore.fields.StreamField((('half_paragraph', wagtail.wagtailcore.blocks.RichTextBlock(classname='col-md-6')), ('full_paragraph', wagtail.wagtailcore.blocks.RichTextBlock(classname='col-md-12'))), blank=True),
        ),
    ]
