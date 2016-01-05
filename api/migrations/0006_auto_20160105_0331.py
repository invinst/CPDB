# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def create_summary_text(apps, schemaEditor):
    InterfaceText = apps.get_model('api', 'InterfaceText')
    InterfaceText.objects.create(key='summary-help-text', text='This is summary text as provided by the Chicago Police Department')


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_auto_20151231_0448'),
    ]

    operations = [
        migrations.CreateModel(
            name='InterfaceText',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('key', models.SlugField()),
                ('text', models.TextField()),
            ],
        ),
        migrations.AlterField(
            model_name='setting',
            name='requested_document_email_subject',
            field=models.CharField(null=True, blank=True, max_length=255),
        ),
        migrations.RunPython(create_summary_text)
    ]
