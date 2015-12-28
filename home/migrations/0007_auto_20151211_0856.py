# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import wagtail.wagtailcore.fields
import wagtail.wagtailcore.blocks


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0006_auto_20151210_0239'),
    ]

    operations = [
        migrations.AlterField(
            model_name='homepage',
            name='body',
            field=wagtail.wagtailcore.fields.StreamField((('row_section', wagtail.wagtailcore.blocks.StreamBlock((('half_paragraph', wagtail.wagtailcore.blocks.RichTextBlock()), ('full_paragraph', wagtail.wagtailcore.blocks.RichTextBlock())))),), blank=True),
        ),
    ]
