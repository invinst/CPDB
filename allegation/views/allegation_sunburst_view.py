from django.db.models.query_utils import Q

from allegation.views.allegation_api_view import AllegationAPIView
from common.models import DISCIPLINE_CODES
from document.response import JsonResponse


class AllegationSunburstView(AllegationAPIView):
    def get(self, request):
        allegations = self.get_allegations(ignore_filters=['final_outcome', 'final_finding'])
        output = self.fetch_output(self.levels, allegations)

        return JsonResponse({
            'sunburst': {
                'name': 'Allegations',
                'children': output,
            }
        })

    def fetch_output(self, levels, objects):
        output = []
        for level in levels:
            results = objects.filter(level['condition'])
            obj = {
                'name': level['name'],
                'tagValue': level['tagValue'],
                'size': results.count(),
            }
            if obj['size'] and 'children' in level:
                del obj['size']
                obj['children'] = self.fetch_output(level['children'], results)
            output.append(obj)

        return output

    levels = [{
        'name': 'Unsustained',
        'condition': ~Q(final_finding='SU'),
        'tagValue': {
            'label': 'Unsustained',
            'category': 'final_finding_text',
            'value': 'unsustained'
        },
        'children': [{
            'condition': Q(final_finding='DS'),
            'name': 'Discharged',
            'tagValue': {
                'label': 'Discharged',
                'category': 'final_finding',
                'value': 'DS',
                'removeParent': True
            },
        }, {
            'condition': Q(final_finding='EX'),
            'name': 'Exonerated',
            'tagValue': {
                'label': 'Exonerated',
                'category': 'final_finding',
                'value': 'EX',
                'removeParent': True
            },
        }, {
            'condition': Q(final_finding='NA'),
            'name': 'No Affidavit',
            'tagValue': {
                'label': 'No Affidavit',
                'category': 'final_finding',
                'value': 'NA',
                'removeParent': True
            },
        }, {
            'condition': Q(final_finding='NC'),
            'name': 'No Cooperation',
            'tagValue': {
                'label': 'No Cooperation',
                'category': 'final_finding',
                'value': 'NC',
                'removeParent': True
            },
        }, {
            'condition': Q(final_finding='NS'),
            'name': 'Not Sustained',
            'tagValue': {
                'label': 'Not Sustained',
                'category': 'final_finding',
                'value': 'NS',
                'removeParent': True
            },
        }, {
            'condition': Q(final_finding='UN'),
            'name': 'Unfounded',
            'tagValue': {
                'label': 'Unfounded',
                'category': 'final_finding',
                'value': 'UN',
                'removeParent': True
            },
        }, {
            'condition': Q(final_finding='ZZ'),
            'name': 'Unknown',
            'tagValue': {
                'label': 'Unknown',
                'category': 'final_finding',
                'value': None,
                'removeParent': True
            },
        }]
    }, {
        'name': 'Sustained',
        'condition': Q(final_finding='SU'),
        'tagValue': {
            'label': 'Sustained',
            'category': 'final_finding',
            'value': 'SU',
        },
        'children': [{
            'name': 'Disciplined',
            'condition': Q(final_outcome__in=DISCIPLINE_CODES) or Q(final_outcome__isnull=True),
            'tagValue': {
                'label': 'Any Disciplined',
                'category': 'outcome_text',
                'value': 'any discipline',
            },
            'children': [{
                'condition': Q(final_outcome='100'),
                'name': 'Reprimand',
                'tagValue': {
                    'label': 'Reprimand',
                    'category': 'final_outcome',
                    'value': '100',
                    'removeParent': True
                },
            }, {
                'condition': Q(final_outcome__in=[str(x).zfill(3) for x in range(1, 10)]),  # 001 to 009
                'name': '1-9 days',
                'tagValue': {
                    'label': '1-9 days',
                    'category': 'outcome_text',
                    'value': '1-9 days',
                    'removeParent': True
                }
            }, {
                'condition': Q(final_outcome__in=[str(x).zfill(3) for x in range(10, 31)]),  # 010 to 030
                'name': '10-30 days',
                'tagValue': {
                    'label': '10-30 days',
                    'category': 'outcome_text',
                    'value': '10-30 days',
                    'removeParent': True
                }
            }, {
                'condition': Q(final_outcome__in=['045', '060', '090', '120', '180', '200']),
                'name': '30+ days',
                'tagValue': {
                    'label': '30+ days',
                    'category': 'outcome_text',
                    'value': '30 more days',
                    'removeParent': True
                },
            }, {
                'condition': Q(final_outcome='300'),
                'name': 'Termination',
                'tagValue': {
                    'label': 'Termination',
                    'category': 'final_outcome',
                    'value': '300',
                    'removeParent': True
                },
            }, {
                'condition': Q(final_outcome='400'),
                'name': 'Separation',
                'tagValue': {
                    'label': 'Separation',
                    'category': 'final_outcome',
                    'value': '400',
                    'removeParent': True
                },
            }]
        }, {
            'name': 'Not Disciplined',
            'condition': ~Q(final_outcome__in=DISCIPLINE_CODES),
            'tagValue': {
                'label': 'No discipline',
                'category': 'outcome_text',
                'value': 'no discipline',
            },
            'children': [{
                'condition': Q(final_outcome=None),
                'name': 'Unknown',
                'tagValue': {
                    'label': 'Unknown',
                    'category': 'final_outcome',
                    'value': None,
                    'removeParent': True
                },
            }, {
                'condition': Q(final_outcome='000'),
                'name': 'Noted',
                'tagValue': {
                    'label': 'Noted',
                    'category': 'final_outcome',
                    'value': '000',
                    'removeParent': True
                },

            }, {
                'condition': Q(final_outcome='500'),
                'name': 'Reinstated by Police Board',
                'tagValue': {
                    'label': 'Reinstated by Police Board',
                    'category': 'final_outcome',
                    'value': '500',
                    'removeParent': True
                },

            }, {
                'condition': Q(final_outcome='600'),
                'name': 'No action taken',
                'tagValue': {
                    'label': 'No action taken',
                    'category': 'final_outcome',
                    'value': '600',
                    'removeParent': True
                },

            }, {
                'condition': Q(final_outcome='700'),
                'name': 'Reinstated by Court Action',
                'tagValue': {
                    'label': 'Reinstated by Court Action',
                    'category': 'final_outcome',
                    'value': '700',
                    'removeParent': True
                },

            }, {
                'condition': Q(final_outcome='800'),
                'name': 'Not served (resigned)',
                'tagValue': {
                    'label': 'ot served (resigned)',
                    'category': 'final_outcome',
                    'value': '800',
                    'removeParent': True
                },

            }, {
                'condition': Q(final_outcome='900'),
                'name': 'Not served (inactive)',
                'tagValue': {
                    'label': 'Not served (inactive)',
                    'category': 'final_outcome',
                    'value': '900',
                    'removeParent': True
                },

            }]
        }]
    }]
