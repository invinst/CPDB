from allegation.utils.query import OfficerQuery
from common.models import Officer, Allegation


LIMIT = 5


class MobileSuggestionService(object):
    def suggest_officer_star(self, query):
        try:
            star = float(query)
            return Officer.objects.filter(star=star).first()
        except ValueError:
            return None

    def suggest_crid(self, query):
        return Allegation.objects.filter(crid=query).first()

    def suggest_officer_name(self, query):
        return Officer.objects.filter(OfficerQuery.condition_by_name(query)).order_by('-allegations_count').all()[:LIMIT]
