from django.db.models.query_utils import Q

from common.constants import DISCIPLINE_CODES


class SunburstSerializer(object):
    def __init__(self, officer_allegations):
        self.data = self._serialize(officer_allegations)

    def _serialize(self, officer_allegations):
        results = []
        queue = [(self.structs, officer_allegations, results)]

        while queue:
            structs, oas, output = queue.pop()
            for struct in structs:
                sub_oas = oas.filter(struct['condition'])
                obj = {
                    'name': struct['name'],
                    'tagValue': struct['tagValue'],
                    'size': sub_oas.count(),
                }
                output.append(obj)
                if obj['size'] and 'children' in struct:
                    del obj['size']
                    obj['children'] = []
                    queue.append((struct['children'], sub_oas, obj['children']))

        return results

    structs = [{
        'name': 'Unsustained',
        'condition': ~Q(final_finding='SU'),
        'tagValue': {
            'label': 'Unsustained',
            'category': 'Final Finding',
            'filter': 'final_finding_text',
            'value': 'unsustained'
        },
        'children': [
            {
                'condition': Q(final_finding='DS'),
                'name': 'Discharged',
                'tagValue': {
                    'label': 'Discharged',
                    'category': 'Final Finding',
                    'filter': 'final_finding',
                    'value': 'DS',
                    'removeParent': True
                },
            }, {
                'condition': Q(final_finding='EX'),
                'name': 'Exonerated',
                'tagValue': {
                    'label': 'Exonerated',
                    'category': 'Final Finding',
                    'filter': 'final_finding',
                    'value': 'EX',
                    'removeParent': True
                },
            }, {
                'condition': Q(final_finding='NA'),
                'name': 'No Affidavit',
                'tagValue': {
                    'label': 'No Affidavit',
                    'category': 'Final Finding',
                    'filter': 'final_finding',
                    'value': 'NA',
                    'removeParent': True
                },
            }, {
                'condition': Q(final_finding='NC'),
                'name': 'No Cooperation',
                'tagValue': {
                    'label': 'No Cooperation',
                    'category': 'Final Finding',
                    'filter': 'final_finding',
                    'value': 'NC',
                    'removeParent': True
                },
            }, {
                'condition': Q(final_finding='NS'),
                'name': 'Not Sustained',
                'tagValue': {
                    'label': 'Not Sustained',
                    'category': 'Final Finding',
                    'filter': 'final_finding',
                    'value': 'NS',
                    'removeParent': True
                },
            }, {
                'condition': Q(final_finding='UN'),
                'name': 'Unfounded',
                'tagValue': {
                    'label': 'Unfounded',
                    'category': 'Final Finding',
                    'filter': 'final_finding',
                    'value': 'UN',
                    'removeParent': True
                },
            }, {
                'condition': Q(final_finding='ZZ'),
                'name': 'Unknown',
                'tagValue': {
                    'label': 'Unknown',
                    'category': 'Final Finding',
                    'filter': 'final_finding',
                    'value': 'ZZ',
                    'removeParent': True
                },
            }
        ]
    }, {
        'name': 'Sustained',
        'condition': Q(final_finding='SU'),
        'tagValue': {
            'label': 'Sustained',
            'category': 'Final Finding',
            'filter': 'final_finding',
            'value': 'SU',
        },
        'children': [
            {
                'name': 'Disciplined',
                'condition':
                    Q(final_outcome__in=DISCIPLINE_CODES),
                'tagValue': {
                    'label': 'Any Disciplined',
                    'category': 'Outcome',
                    'filter': 'outcome_text',
                    'value': 'any discipline',
                    },
                'children': [
                    {
                        'condition': Q(final_outcome='100'),
                        'name': 'Reprimand',
                        'tagValue': {
                            'label': 'Reprimand',
                            'category': 'Final Outcome',
                            'filter': 'final_outcome',
                            'value': '100',
                            'removeParent': True
                        },
                    }, {
                        # 001 to 009
                        'condition': Q(
                            final_outcome__in=[str(x).zfill(3) for x in range(1, 10)]),
                        'name': '1-9 days',
                        'tagValue': {
                            'label': '1-9 days',
                            'category': 'Outcome',
                            'filter': 'outcome_text',
                            'value': '1-9 days',
                            'removeParent': True
                        }
                    }, {
                        # 010 to 030
                        'condition': Q(final_outcome__in=[
                            str(x).zfill(3) for x in range(10, 31)]),
                        'name': '10-30 days',
                        'tagValue': {
                            'label': '10-30 days',
                            'category': 'Outcome',
                            'filter': 'outcome_text',
                            'value': '10-30 days',
                            'removeParent': True
                        }
                    }, {
                        'condition': Q(final_outcome__in=[
                            '045', '060', '090', '120', '180', '200']),
                        'name': '30+ days',
                        'tagValue': {
                            'label': '30+ days',
                            'category': 'Outcome',
                            'filter': 'outcome_text',
                            'value': '30 more days',
                            'removeParent': True
                        },
                    }, {
                        'condition': Q(final_outcome='300'),
                        'name': 'Termination',
                        'tagValue': {
                            'label': 'Termination',
                            'category': 'Final Outcome',
                            'filter': 'final_outcome',
                            'value': '300',
                            'removeParent': True
                        },
                    }, {
                        'condition': Q(final_outcome='400'),
                        'name': 'Separation',
                        'tagValue': {
                            'label': 'Separation',
                            'category': 'Final Outcome',
                            'filter': 'final_outcome',
                            'value': '400',
                            'removeParent': True
                        }
                    }]
            }, {
                'name': 'Not Disciplined',
                'condition': ~Q(final_outcome__in=DISCIPLINE_CODES),
                'tagValue': {
                    'label': 'No discipline',
                    'category': 'Outcome',
                    'filter': 'outcome_text',
                    'value': 'no discipline',
                },
                'children': [
                    {
                        'condition': Q(final_outcome__isnull=True),
                        'name': 'Unknown',
                        'tagValue': {
                            'label': 'Unknown',
                            'category': 'Final Outcome',
                            'filter': 'final_outcome',
                            'value': None,
                            'removeParent': True
                        },
                    }, {
                        'condition': Q(final_outcome='000'),
                        'name': 'Noted',
                        'tagValue': {
                            'label': 'Noted',
                            'category': 'Final Outcome',
                            'filter': 'final_outcome',
                            'value': '000',
                            'removeParent': True
                        },
                    }, {
                        'condition': Q(final_outcome='500'),
                        'name': 'Reinstated by Police Board',
                        'tagValue': {
                            'label': 'Reinstated by Police Board',
                            'category': 'Final Outcome',
                            'filter': 'final_outcome',
                            'value': '500',
                            'removeParent': True
                        },
                    }, {
                        'condition': Q(final_outcome='600'),
                        'name': 'No action taken',
                        'tagValue': {
                            'label': 'No action taken',
                            'category': 'Final Outcome',
                            'filter': 'final_outcome',
                            'value': '600',
                            'removeParent': True
                        },
                    }, {
                        'condition': Q(final_outcome='700'),
                        'name': 'Reinstated by Court Action',
                        'tagValue': {
                            'label': 'Reinstated by Court Action',
                            'category': 'Final Outcome',
                            'filter': 'final_outcome',
                            'value': '700',
                            'removeParent': True
                        },
                    }, {
                        'condition': Q(final_outcome='800'),
                        'name': 'Not served (resigned)',
                        'tagValue': {
                            'label': 'Not served (resigned)',
                            'category': 'Final Outcome',
                            'filter': 'final_outcome',
                            'value': '800',
                            'removeParent': True
                        },
                    }, {
                        'condition': Q(final_outcome='900'),
                        'name': 'Not served (inactive)',
                        'tagValue': {
                            'label': 'Not served (inactive)',
                            'category': 'Final Outcome',
                            'filter': 'final_outcome',
                            'value': '900',
                            'removeParent': True
                        },
                    }
                ]
            }
        ]
    }]
