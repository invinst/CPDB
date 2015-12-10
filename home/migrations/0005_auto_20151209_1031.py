# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import wagtail.wagtailcore.blocks
import wagtail.wagtailcore.fields
import wagtail.wagtailimages.blocks


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0004_homepage_stream_body'),
    ]

    operations = [
        migrations.AlterField(
            model_name='homepage',
            name='stream_body',
            field=wagtail.wagtailcore.fields.StreamField((('half_paragraph', wagtail.wagtailcore.blocks.RichTextBlock(classname='col-md-6')), ('full_paragraph', wagtail.wagtailcore.blocks.RichTextBlock(classname='col-md-12')), ('image', wagtail.wagtailimages.blocks.ImageChooserBlock()), ('heading', wagtail.wagtailcore.blocks.CharBlock(classname='full title'))), blank=True),
        ),
    ]
