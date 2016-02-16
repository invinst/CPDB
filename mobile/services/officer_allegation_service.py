from itertools import groupby

from common.models import OfficerAllegation


class OfficerAllegationService(object):
    @staticmethod
    def get_officer_allegations(officer_id):
        allegation_pks = OfficerAllegation.objects.filter(officer=officer_id).values_list('allegation__pk', flat=True)
        officer_allegations = OfficerAllegation.objects.filter(allegation__pk__in=allegation_pks).order_by(
            'allegation_id').prefetch_related('cat', 'officer')
        officer_allegations = groupby(officer_allegations, lambda x: x.allegation_id)

        results = []
        for _, sub_list in officer_allegations:
            sub_list = list(sub_list)
            officer_allegations_counts = [
                officer_allegation.officer.allegations_count
                for officer_allegation in sub_list]
            results.append({
                'data': sub_list[0],
                'allegation_counts':
                    sorted(officer_allegations_counts, reverse=True)
            })

        return results
