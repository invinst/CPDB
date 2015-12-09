# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.core.management import call_command

def set_school_grounds_radius(app, scheme):
    #call_command('increase_school_radius', radius='1000')
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('common', '0034_allegation_document_requested'),
    ]

    operations = [
        migrations.RunPython(set_school_grounds_radius),
    ]
