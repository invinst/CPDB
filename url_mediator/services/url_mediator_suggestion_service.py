from collections import OrderedDict

from search.services.suggest.suggest_allegation import SuggestAllegationCrid
from search.services.suggest.suggest_investigator import SuggestInvestigator
from search.services.suggest.suggest_officer import SuggestOfficerStar, SuggestOfficerName
from search.services.suggestion_service import SuggestionService


class UrlMediatorSuggestionService(SuggestionService):
    def __init__(self):
        super().__init__()
        # Please don't change this order, it related to the order which will priority to pick the best match
        self.suggests = [
            SuggestOfficerName,
            SuggestAllegationCrid,
            SuggestOfficerStar,
            SuggestInvestigator
        ]

    def pick_the_best_matched_for(self, term):
        suggestions = self.make_suggestion(term)

        for key, values in suggestions.items():
            return OrderedDict({key: [values[0]]})

        return OrderedDict()
