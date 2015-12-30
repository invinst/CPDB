from itertools import groupby

from common.models import Allegation


class AllegationService(object):
    @staticmethod
    def get_officer_allegations(officer_id):
        crids = Allegation.objects.filter(officer=officer_id).values_list('crid', flat=True)
        allegations = groupby(Allegation.objects.filter(crid__in=crids).prefetch_related('cat'), lambda x: x.crid)
        allegation_results = []

        for key, allegation_list in allegations:
            new_allegations = list(allegation_list)
            officers = []

            for allegation in new_allegations:
                officers.append(allegation.officer.allegations_count)

            allegation_results.append({
                'data': new_allegations[0],
                'allegation_counts': sorted(officers, reverse=True)
            })

        return allegation_results
