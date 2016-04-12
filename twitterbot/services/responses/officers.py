from common.models import Officer
from search.services.suggest.suggest_officer import SuggestOfficerName
from twitterbot.models import TwitterResponse
from twitterbot.services.responses.base import BaseResponses


class OfficerResponses(BaseResponses):
    RESPONSE_TYPE = 'officer'

    def get_instances_from_names(self):
        responses = []
        officers = []

        for name, sources in self.names.items():
            sources = set(sources)

            search_results = SuggestOfficerName.query(name)
            # TODO: get pk list and use 1 query to get all
            # TODO: get matched_strings
            if search_results['Officer']:
                officer = Officer.objects.get(pk=search_results['Officer'][0]['tag_value']['value'])
                if officer not in officers and officer.display_name.lower() == name.lower():
                    response = TwitterResponse(entity=officer, matched_strings=', '.join(sources))
                    officers.append(officer)
                    responses.append(response)

        return responses
