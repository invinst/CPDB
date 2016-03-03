from search.services.suggest.suggest_allegation import SuggestAllegationCrid
from search.services.suggest.suggest_investigator import SuggestInvestigator
from search.services.suggest.suggest_officer import SuggestOfficerStar, SuggestOfficerName
from search.services.suggestion_service import SuggestionService


class UrlMediatorSuggestionService(SuggestionService):
    def __init__(self):
        super().__init__()
        self.suggests = [
            SuggestOfficerName,
            SuggestAllegationCrid,
            SuggestOfficerStar,
            SuggestInvestigator
        ]
