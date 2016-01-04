from itertools import groupby

from common.models import OfficerAllegation


class AllegationService(object):
    @staticmethod
    def get_officer_allegations(officer_id):
        officer_allegations = OfficerAllegation.objects.filter(
            officer=officer_id)
        officer_allegations = groupby(
            officer_allegations.prefetch_related('cat'),
            lambda x: x.allegation.crid)

        results = []
        for _, sub_list in officer_allegations:
            officer_allegations_counts = [
                officer_allegation.officer.allegations_count
                for officer_allegation in list(sub_list)]
            results.append({
                'data': sub_list[0].allegation,
                'allegations_count':
                    sorted(officer_allegations_counts, reverse=True)
                })

        return results
