# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('document', '0003_document'),
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
