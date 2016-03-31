# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import csv

from django.db import models, migrations


def create_glossary_page(apps, schema_editor):
    ContentType = apps.get_model('contenttypes.ContentType')
    GlossaryPage = apps.get_model('wagtail_app.GlossaryPage')
    HomePage = apps.get_model('wagtail_app.HomePage')
    glossarypage_content_type, _ = ContentType.objects.get_or_create(
        model='glossarypage', app_label='wagtail_app')

    glossary_page = GlossaryPage.objects.create(
        title='Glossary',
        subtitle='A guide to terms and jargon of Chicago policing and misconduct.',
        slug='glossary',
        content_type=glossarypage_content_type,
        path='000100010001',
        depth=3,
        numchild=0,
        url_path='/home/glossary/',
    )

    home_page = HomePage.objects.get()
    home_page.numchild = 1
    home_page.save()


def remove_glossary_page(apps, schema_editor):
    GlossaryPage = apps.get_model('wagtail_app.GlossaryPage')
    HomePage = apps.get_model('wagtail_app.HomePage')
    GlossaryPage.objects.all().delete()

    home_page = HomePage.objects.get()
    home_page.numchild = 0
    home_page.save()


def create_glossary_table_rows(apps, schema_editor):
    GlossaryTableRows = apps.get_model('wagtail_app.GlossaryTableRows')
    GlossaryPage = apps.get_model('wagtail_app.GlossaryPage')

    glossary_page = GlossaryPage.objects.get()

    with open('wagtail_app/migrations/glossary_data.csv') as data_file:
        reader = csv.reader(data_file)
        # skip header
        next(reader)
        sort_order = 1
        for term, definition, category in reader:
            GlossaryTableRows.objects.create(
                sort_order=sort_order, term=term, definition=definition, category=category, page=glossary_page)
            sort_order += 1


def remove_glossary_table_rows(apps, schema_editor):
    GlossaryTableRows = apps.get_model('wagtail_app.GlossaryTableRows')
    GlossaryTableRows.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('wagtail_app', '0002_create_homepage'),
    ]

    operations = [
        migrations.RunPython(create_glossary_page, remove_glossary_page),
        migrations.RunPython(create_glossary_table_rows, remove_glossary_table_rows),
    ]
