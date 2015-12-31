# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def updated_default_setting(apps, schema_editor):
  Settings = apps.get_model('api', 'Setting')
  message = """Hi,

The document you requested for CR # {crid} is now available: {link}

Best regards,
The Citizens' Police Database
  """
  Settings.objects.all().update(
    requested_document_email_subject='Your requested document for CR # {crid} is now available',
    requested_document_email_text=message
  )

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20151231_0353'),
    ]

    operations = [
      migrations.RunPython(updated_default_setting)
    ]
