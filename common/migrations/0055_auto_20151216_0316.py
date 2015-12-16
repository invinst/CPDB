# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0054_auto_20151215_0358'),
    ]

    operations = [
        migrations.AddField(
            model_name='officer',
            name='active',
            field=models.CharField(default='Unknown', max_length='10', choices=[['Yes', 'Active'], ['No', 'Inactive'], ['Unknown', 'Unknown']]),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='location',
            field=models.CharField(max_length=20, blank=True, null=True, choices=[['01', 'Food Sales/Restaurant'], ['02', 'Tavern/Liquor Store'], ['03', 'Other Business Establishment'], ['04', 'Police Building'], ['05', 'Lockup Facility'], ['06', 'Police Maintenance Facility'], ['07', 'CPD Automotive Pound Facility'], ['08', 'Other Police Property'], ['09', 'Police Communications System'], ['10', 'Court Room'], ['11', 'Public Transportation Veh./Facility'], ['12', 'Park District Property'], ['13', 'Airport'], ['14', 'Public Property - Other'], ['15', 'Other Private Premise'], ['16', 'Expressway/Interstate System'], ['17', 'Public Way - Other'], ['18', 'Waterway. Incl Park District'], ['19', 'Private Residence']]),
        ),
        migrations.AlterField(
            model_name='officer',
            name='allegations_count',
            field=models.IntegerField(default=0, blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='officer',
            name='birth_year',
            field=models.IntegerField(default=0, blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='officer',
            name='discipline_count',
            field=models.IntegerField(default=0, blank=True, null=True),
        ),
    ]
