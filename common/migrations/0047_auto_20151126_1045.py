# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0046_auto_20151118_0955'),
    ]

    operations = [
        migrations.AlterField(
            model_name='allegation',
            name='add1',
            field=models.IntegerField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='add2',
            field=models.CharField(null=True, blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='cat',
            field=models.ForeignKey(to='common.AllegationCategory', null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='city',
            field=models.CharField(null=True, blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='document_id',
            field=models.IntegerField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='document_normalized_title',
            field=models.CharField(null=True, blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='document_title',
            field=models.CharField(null=True, blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='end_date',
            field=models.DateField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='final_finding',
            field=models.CharField(null=True, blank=True, db_index=True, choices=[['UN', 'Unfounded'], ['EX', 'Exonerated'], ['NS', 'Not Sustained'], ['SU', 'Sustained'], ['NC', 'No Cooperation'], ['NA', 'No Affidavit'], ['DS', 'Discharged'], ['ZZ', 'Unknown']], max_length=2),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='final_outcome',
            field=models.CharField(null=True, blank=True, db_index=True, choices=[['000', 'Violation Noted'], ['001', '1 Day Suspension'], ['002', '2 Day Suspension'], ['003', '3 Day Suspension'], ['004', '4 Day Suspension'], ['005', '5 Day Suspension'], ['006', '6 Day Suspension'], ['007', '7 Day Suspension'], ['008', '8 Day Suspension'], ['009', '9 Day Suspension'], ['010', '10 Day Suspension'], ['011', '11 Day Suspension'], ['012', '12 Day Suspension'], ['013', '13 Day Suspension'], ['014', '14 Day Suspension'], ['015', '15 Day Suspension'], ['016', '16 Day Suspension'], ['017', '17 Day Suspension'], ['018', '18 Day Suspension'], ['019', '19 Day Suspension'], ['020', '20 Day Suspension'], ['021', '21 Day Suspension'], ['022', '22 Day Suspension'], ['023', '23 Day Suspension'], ['024', '24 Day Suspension'], ['025', '25 Day Suspension'], ['026', '26 Day Suspension'], ['027', '27 Day Suspension'], ['028', '28 Day Suspension'], ['029', '29 Day Suspension'], ['030', '30 Day Suspension'], ['045', '45 Day Suspension'], ['060', '60 Day Suspension'], ['090', '90 Day Suspension'], ['100', 'Reprimand'], ['200', 'Suspended over 30 Days'], ['300', 'Administrative Termination'], ['400', 'Separation'], ['500', 'Reinstated by Police Board'], ['600', 'No Action Taken'], ['700', 'Reinstated by Court Action'], ['800', 'Resigned'], ['900', 'Penalty Not Served'], [None, 'Unknown']], max_length=3),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='final_outcome_class',
            field=models.CharField(null=True, blank=True, max_length=20),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='incident_date',
            field=models.DateTimeField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='incident_date_only',
            field=models.DateField(null=True, blank=True, db_index=True),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='investigator',
            field=models.ForeignKey(to='common.Investigator', null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='investigator_name',
            field=models.CharField(null=True, blank=True, db_index=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='location',
            field=models.CharField(null=True, blank=True, max_length=20),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='recc_finding',
            field=models.CharField(null=True, blank=True, db_index=True, choices=[['UN', 'Unfounded'], ['EX', 'Exonerated'], ['NS', 'Not Sustained'], ['SU', 'Sustained'], ['NC', 'No Cooperation'], ['NA', 'No Affidavit'], ['DS', 'Discharged'], ['ZZ', 'Unknown']], max_length=2),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='recc_outcome',
            field=models.CharField(null=True, blank=True, db_index=True, choices=[['000', 'Violation Noted'], ['001', '1 Day Suspension'], ['002', '2 Day Suspension'], ['003', '3 Day Suspension'], ['004', '4 Day Suspension'], ['005', '5 Day Suspension'], ['006', '6 Day Suspension'], ['007', '7 Day Suspension'], ['008', '8 Day Suspension'], ['009', '9 Day Suspension'], ['010', '10 Day Suspension'], ['011', '11 Day Suspension'], ['012', '12 Day Suspension'], ['013', '13 Day Suspension'], ['014', '14 Day Suspension'], ['015', '15 Day Suspension'], ['016', '16 Day Suspension'], ['017', '17 Day Suspension'], ['018', '18 Day Suspension'], ['019', '19 Day Suspension'], ['020', '20 Day Suspension'], ['021', '21 Day Suspension'], ['022', '22 Day Suspension'], ['023', '23 Day Suspension'], ['024', '24 Day Suspension'], ['025', '25 Day Suspension'], ['026', '26 Day Suspension'], ['027', '27 Day Suspension'], ['028', '28 Day Suspension'], ['029', '29 Day Suspension'], ['030', '30 Day Suspension'], ['045', '45 Day Suspension'], ['060', '60 Day Suspension'], ['090', '90 Day Suspension'], ['100', 'Reprimand'], ['200', 'Suspended over 30 Days'], ['300', 'Administrative Termination'], ['400', 'Separation'], ['500', 'Reinstated by Police Board'], ['600', 'No Action Taken'], ['700', 'Reinstated by Court Action'], ['800', 'Resigned'], ['900', 'Penalty Not Served'], [None, 'Unknown']], max_length=3),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='record_id',
            field=models.IntegerField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='allegation',
            name='start_date',
            field=models.DateField(null=True, blank=True),
        ),
    ]
