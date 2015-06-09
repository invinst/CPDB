# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.contrib.gis.db.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0017_auto_20150605_0956'),
    ]

    operations = [
        migrations.CreateModel(
            name='Complaint',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('record_id', models.IntegerField(null=True)),
                ('crid', models.CharField(null=True, db_index=True, max_length=30)),
                ('recc_finding', models.CharField(null=True, db_index=True, max_length=2, choices=[['UN', 'Unfounded'], ['EX', 'Exonerated'], ['NS', 'Not Sustained'], ['SU', 'Sustained'], ['NC', 'No Cooperation'], ['NA', 'No Affidavit'], ['DS', 'Discharged']])),
                ('recc_outcome', models.CharField(null=True, db_index=True, max_length=3, choices=[['000', 'Violation Noted'], ['001', '1 Day Suspension'], ['002', '2 Day Suspension'], ['003', '3 Day Suspension'], ['004', '4 Day Suspension'], ['005', '5 Day Suspension'], ['006', '6 Day Suspension'], ['007', '7 Day Suspension'], ['008', '8 Day Suspension'], ['009', '9 Day Suspension'], ['010', '10 Day Suspension'], ['011', '11 Day Suspension'], ['012', '12 Day Suspension'], ['013', '13 Day Suspension'], ['014', '14 Day Suspension'], ['015', '15 Day Suspension'], ['016', '16 Day Suspension'], ['017', '17 Day Suspension'], ['018', '18 Day Suspension'], ['019', '19 Day Suspension'], ['020', '20 Day Suspension'], ['021', '21 Day Suspension'], ['022', '22 Day Suspension'], ['023', '23 Day Suspension'], ['024', '24 Day Suspension'], ['025', '25 Day Suspension'], ['026', '26 Day Suspension'], ['027', '27 Day Suspension'], ['028', '28 Day Suspension'], ['029', '29 Day Suspension'], ['030', '30 Day Suspension'], ['100', 'Reprimand'], ['200', 'Suspended over 30 Days'], ['300', 'Administrative Termination'], ['400', 'Separation'], ['500', 'Reinstated by Police Board'], ['600', 'No Action Taken'], ['700', 'Reinstated by Court Action'], ['800', 'Resigned'], ['900', 'Penalty Not Served']])),
                ('final_finding', models.CharField(null=True, db_index=True, max_length=2, choices=[['UN', 'Unfounded'], ['EX', 'Exonerated'], ['NS', 'Not Sustained'], ['SU', 'Sustained'], ['NC', 'No Cooperation'], ['NA', 'No Affidavit'], ['DS', 'Discharged']])),
                ('final_outcome', models.CharField(null=True, db_index=True, max_length=3, choices=[['000', 'Violation Noted'], ['001', '1 Day Suspension'], ['002', '2 Day Suspension'], ['003', '3 Day Suspension'], ['004', '4 Day Suspension'], ['005', '5 Day Suspension'], ['006', '6 Day Suspension'], ['007', '7 Day Suspension'], ['008', '8 Day Suspension'], ['009', '9 Day Suspension'], ['010', '10 Day Suspension'], ['011', '11 Day Suspension'], ['012', '12 Day Suspension'], ['013', '13 Day Suspension'], ['014', '14 Day Suspension'], ['015', '15 Day Suspension'], ['016', '16 Day Suspension'], ['017', '17 Day Suspension'], ['018', '18 Day Suspension'], ['019', '19 Day Suspension'], ['020', '20 Day Suspension'], ['021', '21 Day Suspension'], ['022', '22 Day Suspension'], ['023', '23 Day Suspension'], ['024', '24 Day Suspension'], ['025', '25 Day Suspension'], ['026', '26 Day Suspension'], ['027', '27 Day Suspension'], ['028', '28 Day Suspension'], ['029', '29 Day Suspension'], ['030', '30 Day Suspension'], ['100', 'Reprimand'], ['200', 'Suspended over 30 Days'], ['300', 'Administrative Termination'], ['400', 'Separation'], ['500', 'Reinstated by Police Board'], ['600', 'No Action Taken'], ['700', 'Reinstated by Court Action'], ['800', 'Resigned'], ['900', 'Penalty Not Served']])),
                ('location', models.CharField(null=True, max_length=20)),
                ('add1', models.IntegerField(null=True)),
                ('add2', models.CharField(null=True, max_length=255)),
                ('city', models.CharField(null=True, max_length=255)),
                ('incident_date', models.DateTimeField(null=True)),
                ('incident_date_only', models.DateField(null=True, db_index=True)),
                ('start_date', models.DateField(null=True)),
                ('end_date', models.DateField(null=True)),
                ('investigator', models.CharField(null=True, db_index=True, max_length=255)),
                ('point', django.contrib.gis.db.models.fields.PointField(null=True, blank=True, srid=4326)),
                ('areas', models.ManyToManyField(blank=True, to='common.Area')),
                ('cat', models.ForeignKey(null=True, to='common.AllegationCategory')),
                ('officers', models.ManyToManyField(to='common.Officer')),
            ],
        ),
    ]
