# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


MIGRATE_FILTERS = [
    'crid',
    'areas__id',
    'investigator',
    'city',
]


def update_sessions(apps, schema_editor):
    Session = apps.get_model('share', 'Session')
    for session in Session.objects.all().exclude(query=None):

        if session.query and 'filters' in session.query:
            for key, value in session.query['filters'].items():
                if key in MIGRATE_FILTERS:
                    session.query['filters'].pop(key)
                    session.query['filters']["allegation__%s" % key] = value
                    session.save()


class Migration(migrations.Migration):

    dependencies = [
        ('share', '0013_session_sunburst_arc'),
    ]

    operations = [
        migrations.RunPython(update_sessions)
    ]
