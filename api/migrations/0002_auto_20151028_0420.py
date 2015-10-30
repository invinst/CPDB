# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def create_default_site_title_setting(apps, schema_editor):
    setting_model = apps.get_model('api', 'setting')
    setting = setting_model(key='DEFAULT_SITE_TITLE', value='Chicago Police Data Project')
    setting.save()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_default_site_title_setting)
    ]

