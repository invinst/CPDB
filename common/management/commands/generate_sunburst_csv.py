import json
import os
import csv

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db.models.query_utils import Q

from common.models import Allegation, DISCIPLINE_CODES


class Command(BaseCommand):
    help = 'Generate sunburst csv data'

    levels = [{
        'name': 'Unsustained',
        'condition': ~Q(final_finding='SU'),
        'children': [{
            'condition': Q(final_finding='DS'),
            'name': 'Discharged',
        }, {
            'condition': Q(final_finding='EX'),
            'name': 'Exonerated',
        }, {
            'condition': Q(final_finding='NA'),
            'name': 'No Affidavit',
        }, {
            'condition': Q(final_finding='NC'),
            'name': 'No Cooperation',
        }, {
            'condition': Q(final_finding='NS'),
            'name': 'Not Sustained',
        }, {
            'condition': Q(final_finding='UN'),
            'name': 'Unfounded',
        }]
    }, {
        'name': 'Sustained',
        'condition': Q(final_finding='SU'),
        'children': [{
            'name': 'Disciplined',
            'condition': Q(final_outcome__in=DISCIPLINE_CODES),
            'children': [{
                'condition': Q(final_outcome='100'),
                'name': 'Reprimand',
            }, {
                'condition': Q(final_outcome__in=[str(x).zfill(3) for x in range(1, 10)]),  # 001 to 009
                'name': '1 to 9 days',
            }, {
                'condition': Q(final_outcome__in=[str(x).zfill(3) for x in range(10, 31)]),  # 010 to 031
                'name': '10 to 30 days',
            }, {
                'condition': Q(final_outcome='200'),
                'name': '30+ days',
            }, {
                'condition': Q(final_outcome='300'),
                'name': 'Termination',
            }, {
                'condition': Q(final_outcome='400'),
                'name': 'Separation',
            }]
        }, {
            'name': 'Not Disciplined',
            'condition': ~Q(final_outcome__in=DISCIPLINE_CODES),
            'children': [{
                'condition': Q(final_outcome=None),
                'name': 'Unknown',
            }, {
                'condition': Q(final_outcome='000'),
                'name': 'Noted',
            }, {
                'condition': Q(final_outcome='500'),
                'name': 'Reinstated by Police Board',
            }, {
                'condition': Q(final_outcome='600'),
                'name': 'No action taken',
            }, {
                'condition': Q(final_outcome='700'),
                'name': 'Reinstated by Court Action',
            }, {
                'condition': Q(final_outcome='800'),
                'name': 'Not served (resigned)',
            }, {
                'condition': Q(final_outcome='900'),
                'name': 'Not served (inactive)',
            }]
        }]
    }]

    def fetch_output(self, levels, objects):
        output = []
        for level in levels:
            results = objects.filter(level['condition'])
            obj = {
                'name': level['name'],
                'size': results.count(),
            }
            if 'children' in level:
                del obj['size']
                obj['children'] = self.fetch_output(level['children'], results)
            output.append(obj)

        return output

    def calculate_end(self, row):
        if not row.get('children'):
            return 0
        return row['size'] - sum(r['size'] for r in row['children'])

    def save(self, output):
        output_file = os.path.join(settings.BASE_DIR, 'common/static/sunburst.json')

        with open(output_file, 'w') as f:
            json.dump({
                'name': 'Allegation',
                'children': output,
            }, f)

        os.system("cat %s" % output_file)

    def handle(self, *args, **options):

        objects = Allegation.objects.all()

        output = self.fetch_output(self.levels, objects)

        self.save(output)
