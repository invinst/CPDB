from common.models import Allegation


class OfficerAllegationService(object):
    @staticmethod
    def get_allegations(officer_id):
        allegations = Allegation.objects.filter(officerallegation__officer_id=officer_id).prefetch_related(
            'officerallegation_set__officer',
            'officerallegation_set__cat')
        return allegations
