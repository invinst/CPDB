# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import common.models.suggestible
import django.contrib.gis.db.models.fields
import django.utils.timezone
import django.core.validators
import django.contrib.auth.models


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0006_require_contenttypes_0002'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('password', models.CharField(verbose_name='password', max_length=128)),
                ('last_login', models.DateTimeField(blank=True, verbose_name='last login', null=True)),
                ('is_superuser', models.BooleanField(default=False, verbose_name='superuser status', help_text='Designates that this user has all permissions without explicitly assigning them.')),
                ('username', models.CharField(unique=True, max_length=30, help_text='Required. 30 characters or fewer. Letters, digits and @/./+/-/_ only.', verbose_name='username', validators=[django.core.validators.RegexValidator('^[\\w.@+-]+$', 'Enter a valid username. This value may contain only letters, numbers and @/./+/-/_ characters.', 'invalid')], error_messages={'unique': 'A user with that username already exists.'})),
                ('first_name', models.CharField(blank=True, verbose_name='first name', max_length=30)),
                ('last_name', models.CharField(blank=True, verbose_name='last name', max_length=30)),
                ('email', models.EmailField(blank=True, verbose_name='email address', max_length=254)),
                ('is_staff', models.BooleanField(default=False, verbose_name='staff status', help_text='Designates whether the user can log into this admin site.')),
                ('is_active', models.BooleanField(default=True, verbose_name='active', help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('groups', models.ManyToManyField(related_name='user_set', related_query_name='user', to='auth.Group', blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(related_name='user_set', related_query_name='user', to='auth.Permission', blank=True, help_text='Specific permissions for this user.', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'abstract': False,
                'verbose_name_plural': 'users',
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Allegation',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('record_id', models.IntegerField(blank=True, null=True)),
                ('crid', models.CharField(null=True, max_length=30, db_index=True)),
                ('summary', models.TextField(blank=True, null=True)),
                ('location', models.CharField(blank=True, choices=[['01', 'Food Sales/Restaurant'], ['02', 'Tavern/Liquor Store'], ['03', 'Other Business Establishment'], ['04', 'Police Building'], ['05', 'Lockup Facility'], ['06', 'Police Maintenance Facility'], ['07', 'CPD Automotive Pound Facility'], ['08', 'Other Police Property'], ['09', 'Police Communications System'], ['10', 'Court Room'], ['11', 'Public Transportation Veh./Facility'], ['12', 'Park District Property'], ['13', 'Airport'], ['14', 'Public Property - Other'], ['15', 'Other Private Premise'], ['16', 'Expressway/Interstate System'], ['17', 'Public Way - Other'], ['18', 'Waterway. Incl Park District'], ['19', 'Private Residence']], max_length=20, null=True)),
                ('add1', models.IntegerField(blank=True, null=True)),
                ('add2', models.CharField(blank=True, max_length=255, null=True)),
                ('city', models.CharField(blank=True, max_length=255, null=True)),
                ('incident_date', models.DateTimeField(blank=True, null=True)),
                ('incident_date_only', models.DateField(blank=True, db_index=True, null=True)),
                ('investigator_name', models.CharField(blank=True, max_length=255, db_index=True, null=True)),
                ('document_id', models.IntegerField(blank=True, null=True)),
                ('document_normalized_title', models.CharField(blank=True, max_length=255, null=True)),
                ('document_title', models.CharField(blank=True, max_length=255, null=True)),
                ('document_requested', models.BooleanField(default=False)),
                ('document_pending', models.BooleanField(default=False)),
                ('number_of_request', models.IntegerField(default=0)),
                ('last_requested', models.DateTimeField(default=django.utils.timezone.now)),
                ('point', django.contrib.gis.db.models.fields.PointField(blank=True, srid=4326, null=True)),
                ('source', models.CharField(null=True, max_length=20)),
            ],
            options={
                'abstract': False,
            },
            bases=(common.models.suggestible.MobileSuggestibleAllegation, models.Model),
        ),
        migrations.CreateModel(
            name='AllegationCategory',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('cat_id', models.CharField(max_length=255)),
                ('category', models.CharField(null=True, max_length=255, db_index=True)),
                ('allegation_name', models.CharField(null=True, max_length=255, db_index=True)),
                ('allegation_count', models.IntegerField(default=0)),
                ('category_count', models.IntegerField(default=0)),
                ('on_duty', models.BooleanField(default=False)),
                ('citizen_dept', models.CharField(default='citizen', choices=[('citizen', 'Citizen'), ('dept', 'Dept'), ('?', 'Unknown')], max_length=50)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Area',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=100)),
                ('type', models.CharField(max_length=30, choices=[['beat', 'Beat'], ['neighborhood', 'Neighborhood'], ['school-grounds', 'School Grounds'], ['ward', 'Ward'], ['police-districts', 'Police District']], db_index=True)),
                ('polygon', django.contrib.gis.db.models.fields.MultiPolygonField(blank=True, srid=4326, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ComplainingWitness',
            fields=[
                ('cwit_id', models.AutoField(serialize=False, primary_key=True)),
                ('crid', models.CharField(null=True, max_length=30, db_index=True)),
                ('gender', models.CharField(null=True, max_length=1)),
                ('race', models.CharField(null=True, max_length=50)),
                ('age', models.IntegerField(null=True)),
                ('allegation', models.ForeignKey(to='common.Allegation', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Investigator',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('raw_name', models.CharField(max_length=160)),
                ('name', models.CharField(max_length=160)),
                ('complaint_count', models.IntegerField(default=0)),
                ('discipline_count', models.IntegerField(default=0)),
                ('current_rank', models.CharField(null=True, max_length=50)),
                ('current_report', models.CharField(null=True, max_length=4)),
                ('unit', models.CharField(null=True, max_length=50)),
                ('agency', models.CharField(choices=[['IPRA', 'IPRA'], ['IAD', 'IAD']], max_length=10)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Officer',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('officer_first', models.CharField(blank=True, max_length=255, db_index=True, null=True)),
                ('officer_last', models.CharField(blank=True, max_length=255, db_index=True, null=True)),
                ('gender', models.CharField(blank=True, max_length=1, null=True)),
                ('race', models.CharField(blank=True, max_length=50, null=True)),
                ('appt_date', models.DateField(blank=True, null=True)),
                ('unit', models.CharField(blank=True, max_length=5, null=True)),
                ('rank', models.CharField(blank=True, max_length=5, null=True)),
                ('star', models.FloatField(blank=True, null=True)),
                ('allegations_count', models.IntegerField(blank=True, default=0, null=True)),
                ('discipline_count', models.IntegerField(blank=True, default=0, null=True)),
                ('birth_year', models.IntegerField(blank=True, default=0, null=True)),
                ('active', models.CharField(default='Unknown', choices=[['Yes', 'Active'], ['No', 'Inactive'], ['Unknown', 'Unknown']], max_length='10')),
            ],
            options={
                'abstract': False,
            },
            bases=(common.models.suggestible.MobileSuggestibleOfficer, models.Model),
        ),
        migrations.CreateModel(
            name='OfficerAllegation',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('recc_finding', models.CharField(blank=True, max_length=2, choices=[['UN', 'Unfounded'], ['EX', 'Exonerated'], ['NS', 'Not Sustained'], ['SU', 'Sustained'], ['NC', 'No Cooperation'], ['NA', 'No Affidavit'], ['DS', 'Discharged'], ['ZZ', 'Unknown']], db_index=True, null=True)),
                ('recc_outcome', models.CharField(blank=True, max_length=3, choices=[['000', 'Violation Noted'], ['001', '1 Day Suspension'], ['002', '2 Day Suspension'], ['003', '3 Day Suspension'], ['004', '4 Day Suspension'], ['005', '5 Day Suspension'], ['006', '6 Day Suspension'], ['007', '7 Day Suspension'], ['008', '8 Day Suspension'], ['009', '9 Day Suspension'], ['010', '10 Day Suspension'], ['011', '11 Day Suspension'], ['012', '12 Day Suspension'], ['013', '13 Day Suspension'], ['014', '14 Day Suspension'], ['015', '15 Day Suspension'], ['016', '16 Day Suspension'], ['017', '17 Day Suspension'], ['018', '18 Day Suspension'], ['019', '19 Day Suspension'], ['020', '20 Day Suspension'], ['021', '21 Day Suspension'], ['022', '22 Day Suspension'], ['023', '23 Day Suspension'], ['024', '24 Day Suspension'], ['025', '25 Day Suspension'], ['026', '26 Day Suspension'], ['027', '27 Day Suspension'], ['028', '28 Day Suspension'], ['029', '29 Day Suspension'], ['030', '30 Day Suspension'], ['045', '45 Day Suspension'], ['060', '60 Day Suspension'], ['090', '90 Day Suspension'], ['100', 'Reprimand'], ['120', 'Suspended for 120 Days'], ['180', 'Suspended for 180 Days'], ['200', 'Suspended over 30 Days'], ['300', 'Administrative Termination'], ['400', 'Separation'], ['500', 'Reinstated by Police Board'], ['600', 'No Action Taken'], ['700', 'Reinstated by Court Action'], ['800', 'Resigned'], ['900', 'Penalty Not Served'], [None, 'Unknown']], db_index=True, null=True)),
                ('final_finding', models.CharField(blank=True, max_length=2, choices=[['UN', 'Unfounded'], ['EX', 'Exonerated'], ['NS', 'Not Sustained'], ['SU', 'Sustained'], ['NC', 'No Cooperation'], ['NA', 'No Affidavit'], ['DS', 'Discharged'], ['ZZ', 'Unknown']], db_index=True, null=True)),
                ('final_outcome', models.CharField(blank=True, max_length=3, choices=[['000', 'Violation Noted'], ['001', '1 Day Suspension'], ['002', '2 Day Suspension'], ['003', '3 Day Suspension'], ['004', '4 Day Suspension'], ['005', '5 Day Suspension'], ['006', '6 Day Suspension'], ['007', '7 Day Suspension'], ['008', '8 Day Suspension'], ['009', '9 Day Suspension'], ['010', '10 Day Suspension'], ['011', '11 Day Suspension'], ['012', '12 Day Suspension'], ['013', '13 Day Suspension'], ['014', '14 Day Suspension'], ['015', '15 Day Suspension'], ['016', '16 Day Suspension'], ['017', '17 Day Suspension'], ['018', '18 Day Suspension'], ['019', '19 Day Suspension'], ['020', '20 Day Suspension'], ['021', '21 Day Suspension'], ['022', '22 Day Suspension'], ['023', '23 Day Suspension'], ['024', '24 Day Suspension'], ['025', '25 Day Suspension'], ['026', '26 Day Suspension'], ['027', '27 Day Suspension'], ['028', '28 Day Suspension'], ['029', '29 Day Suspension'], ['030', '30 Day Suspension'], ['045', '45 Day Suspension'], ['060', '60 Day Suspension'], ['090', '90 Day Suspension'], ['100', 'Reprimand'], ['120', 'Suspended for 120 Days'], ['180', 'Suspended for 180 Days'], ['200', 'Suspended over 30 Days'], ['300', 'Administrative Termination'], ['400', 'Separation'], ['500', 'Reinstated by Police Board'], ['600', 'No Action Taken'], ['700', 'Reinstated by Court Action'], ['800', 'Resigned'], ['900', 'Penalty Not Served'], [None, 'Unknown']], db_index=True, null=True)),
                ('final_outcome_class', models.CharField(blank=True, max_length=20, null=True)),
                ('start_date', models.DateField(blank=True, null=True)),
                ('end_date', models.DateField(blank=True, null=True)),
                ('allegation', models.ForeignKey(to='common.Allegation', null=True)),
                ('cat', models.ForeignKey(to='common.AllegationCategory', null=True)),
                ('officer', models.ForeignKey(to='common.Officer', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='OfficerHistory',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('unit', models.CharField(null=True, max_length=5)),
                ('rank', models.CharField(null=True, max_length=5)),
                ('star', models.FloatField(null=True)),
                ('as_of', models.DateField(null=True)),
                ('officer', models.ForeignKey(to='common.Officer', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='PendingPdfAllegation',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('crid', models.CharField(null=True, max_length=30, db_index=True)),
                ('raw_content', models.TextField(blank=True, null=True)),
                ('notification_date', models.DateField(blank=True, null=True)),
                ('finding', models.CharField(blank=True, max_length=255, null=True)),
                ('summary', models.TextField(blank=True, null=True)),
                ('errors', models.TextField(blank=True, null=True)),
                ('areas', models.ManyToManyField(to='common.Area', blank=True)),
                ('cat', models.ForeignKey(to='common.AllegationCategory', blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='PoliceWitness',
            fields=[
                ('pwit_id', models.AutoField(serialize=False, primary_key=True)),
                ('crid', models.CharField(null=True, max_length=30, db_index=True)),
                ('gender', models.CharField(null=True, max_length=1)),
                ('race', models.CharField(null=True, max_length=50)),
                ('allegation', models.ForeignKey(to='common.Allegation', null=True)),
                ('officer', models.ForeignKey(to='common.Officer', null=True)),
            ],
        ),
        migrations.AddField(
            model_name='allegation',
            name='areas',
            field=models.ManyToManyField(to='common.Area', blank=True),
        ),
        migrations.AddField(
            model_name='allegation',
            name='beat',
            field=models.ForeignKey(related_name='beats', to='common.Area', blank=True, null=True),
        ),
        migrations.AddField(
            model_name='allegation',
            name='investigator',
            field=models.ForeignKey(to='common.Investigator', blank=True, null=True),
        ),
    ]
