# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def capitalize_string(string):
    if not string:
        return string
    return " ".join(x.capitalize() for x in string.split(" "))


def upper_case_state_name(apps, schema_editor):
    allegation_model = apps.get_model('common', 'allegation')
    allegations = allegation_model.objects.all()
    for allegation in allegations:
        if allegation.city:
            parts = [x.capitalize() for x in allegation.city.split(" ")]
            for i in range(len(parts)):
                if parts[i].lower() == 'il':
                    parts[i] = 'IL'
                    break
            allegation.city = " ".join(parts)
            allegation.add2 = capitalize_string(allegation.add2)
            allegation.save()


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0035_investigator_discipline_count'),
    ]

    operations = [
        migrations.RunPython(upper_case_state_name)
    ]
