from common.models import Officer
from search.services.suggest.suggest_officer import SuggestOfficerName
from twitterbot.services.responses.base import BaseResponses


class OfficerResponses(BaseResponses):
    RESPONSE_TYPE = 'officer'

    def get_instances_from_names(self, names):
        officers = []

        for name in names:
            search_results = SuggestOfficerName.query(name)
            # TODO: get pk list and use 1 query to get all
            if search_results['Officer']:
                officer = Officer.objects.get(pk=search_results['Officer'][0]['tag_value']['value'])
                if officer not in officers and officer.display_name.lower() == name.lower():
                    officers.append(officer)

        return officers
