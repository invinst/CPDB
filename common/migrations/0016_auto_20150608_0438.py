# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations

def fix_ranks(apps, schema_editor):
    # We can't import the Person model directly as it may be a newer
    # version than this migration expects. We use the historical version.
    ranks = {
    	'PO': 'Police Officer',
    	'LT': 'Lieutenant',
    	'ET': 'Evidence Technician',
    	'DET': 'Detective',
    	'FTO': 'Field Training Officer',
    	'Cpt': 'Captain',
    	'SGT': 'Sergeant',
    	'CMDR': 'Commander',
    	'Agent': 'Agent',
    	'Chief': 'Chief',
    	'': 'N/A',
    }
    for officer in apps.get_model('common','Officer').objects.all():
    	if officer.rank in ranks:
	    	officer.rank_display = ranks[officer.rank]
    	officer.save()

class Migration(migrations.Migration):

    dependencies = [
        ('common', '0015_officer_rank_display'),
    ]

    operations = [
    	migrations.RunPython(fix_ranks),
    ]
