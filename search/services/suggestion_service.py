from collections import OrderedDict

from haystack.query import SearchQuerySet

from search.services.suggest.suggest_incident_date import SuggestIncidentDateOnlyYearMonth, SuggestIncidentDateOnly, SuggestIncidentDateOnlyYear
from search.services.suggest.suggest_allegation import SuggestAllegationCity, SuggestAllegationCrid
from search.services.suggest.suggest_allegation_category import SuggestAllegationCategoryCategory, SuggestAllegationCategoryCatId, SuggestAllegationCategoryNameId
from search.services.suggest.suggest_area import SuggestArea
from search.services.suggest.suggest_has import SuggestHas
from search.services.suggest.suggest_investigator import SuggestInvestigator
from search.services.suggest.suggest_officer import SuggestOfficerName, SuggestOfficerStar, SuggestOfficerUnit, SuggestOfficerRank
from search.services.suggest.suggest_session_alias import SuggestSessionAlias
from search.services.suggest.suggest_data_source import SuggestDataSource
from search.services.suggest.suggest_outcome import SuggestOutcome, SuggestOutcomeText


class SuggestionService(object):
    def __init__(self):
        self.suggests = [
            SuggestIncidentDateOnlyYearMonth,
            SuggestIncidentDateOnly,
            SuggestIncidentDateOnlyYear,
            SuggestAllegationCity,
            SuggestAllegationCrid,
            SuggestAllegationCategoryCatId,
            SuggestAllegationCategoryCategory,
            SuggestAllegationCategoryNameId,
            SuggestArea,
            SuggestHas,
            SuggestInvestigator,
            SuggestOfficerName,
            SuggestOfficerStar,
            SuggestOfficerUnit,
            SuggestOfficerRank,
            SuggestSessionAlias,
            SuggestDataSource,
            SuggestOutcome,
            SuggestOutcomeText
        ]

    def make_suggestion(self, q):
        ret = {}
        for suggest in self.suggests:
            group = suggest.query(q)
            if group:
                ret.update(group)

        ret = OrderedDict((k, v) for k, v in ret.items() if v)

        return ret
