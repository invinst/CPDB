from common.models import Investigator
from search.services.suggest.suggest_investigator import SuggestInvestigator
from twitterbot.services.responses.base import BaseResponses


class InvestigatorResponses(BaseResponses):
    RESPONSE_TYPE = 'investigator'

    def get_instances_from_names(self):
        investigators = []

        for name in self.names:
            search_results = SuggestInvestigator.query(name)
            # TODO: get pk list and use 1 query to get all
            if search_results['Investigator']:
                investigator = Investigator.objects.get(pk=search_results['Investigator'][0]['tag_value']['value'])
                if investigator not in investigators and investigator.name.lower() == name.lower():
                    investigators.append(investigator)

        return investigators
