# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='setting',
            name='export_excel_disclaimer',
            field=models.TextField(default='DISCLAIMER:\n\nThe information contained on this website comes primarily from four datasets provided by the Chicago Police Department (CPD), spanning approximately 2001 to 2008 and 2011 to 2015.The CPD has released these lists in response to litigation and to FOIA Requests.\n\nThe City of Chicago’s release of this information was accompanied by a disclaimer that not all of the information contained in the City’s database may be completely accurate. No independent verification of the City’s records has taken place and this public database does not purport to be an accurate reflection of either the City’s internal database or of its truthfulness.\n\nSlight changes to the spelling of officer names and to the wording of abuse categories have been made to accommodate a consistent appearance. Where there is no unique identifying employee information and it is ambiguous whether officers with the same name are the same individual, this database assumes that the officers are different until further information is received. A glossary of our understanding of common CPD terms has been provided. No other editing of the City’s original datasets has taken place.\n\nThis public database also contains other readily available data that has been linked to the City’s original datasets, including: CPD beat geographies, Chicago ward boundaries, Chicago neighborhood boundaries, separate FOIA responses to  journalists, et cetera.\n\nBy entering this website, you acknowledge that the Citizens’ Police Data Project (CPDP) is not responsible for any derivative work performed by or published by users of this public database.', blank=True),
        ),
    ]
