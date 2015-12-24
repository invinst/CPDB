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
            new_allegation = new_allegations[0]
            allegation_results.append({
                'data': new_allegation,
                'num_crids': len(new_allegations)
            })

        return allegation_results
