# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('document', '0004_requestmail_session_nullable'),
    ]

    operations = [
        migrations.AddField(
            model_name='requestemail',
            name='document',
            field=models.ForeignKey(default=None, related_name='requestemails', to='document.Document', null=True),
        ),
        migrations.AlterUniqueTogether(
            name='requestemail',
            unique_together=set([('document', 'email')]),
        ),
    ]
