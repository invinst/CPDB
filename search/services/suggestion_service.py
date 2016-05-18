from collections import OrderedDict

from search.models.alias import Alias
from search.services.suggest.suggest_incident_date import (
    SuggestIncidentDateOnlyYearMonth,
    SuggestIncidentDateOnly,
    SuggestIncidentDateOnlyYear,
    SuggestTimeOfDay)
from search.services.suggest.suggest_allegation import (
    SuggestAllegationCity,
    SuggestAllegationCrid,
    SuggestAllegationSummary)
from search.services.suggest.suggest_allegation_category import (
    SuggestAllegationCategoryCategory,
    SuggestAllegationCategoryCat,
    SuggestAllegationCategoryOnDuty)
from search.services.suggest.suggest_area import SuggestArea
from search.services.suggest.suggest_has import SuggestHas
from search.services.suggest.suggest_investigator import SuggestInvestigator
from search.services.suggest.suggest_investigator_agency import SuggestInvestigatorAgency
from search.services.suggest.suggest_officer import (
    SuggestOfficerName,
    SuggestOfficerStar,
    SuggestOfficerUnit,
    SuggestOfficerRank,
    SuggestOfficerActive)
from search.services.suggest.suggest_session_alias import SuggestSessionAlias
from search.services.suggest.suggest_data_source import SuggestDataSource
from search.services.suggest.suggest_outcome import (
    SuggestOutcome,
    SuggestOutcomeText)
from search.services.suggest.suggest_race_gender import SuggestRaceGender
from search.services.suggest.suggest_repeat_offenders import SuggestRepeatOffenders
from search.services.suggest.suggest_finding import SuggestFinding
from search.utils.format_suggest import format_suggest


class SuggestionService(object):
    def __init__(self):
        self.suggests = [
            SuggestIncidentDateOnlyYearMonth,
            SuggestOfficerStar,
            SuggestAllegationCity,
            SuggestAllegationCrid,
            SuggestAllegationSummary,
            SuggestIncidentDateOnly,
            SuggestIncidentDateOnlyYear,
            SuggestTimeOfDay,
            SuggestOfficerName,
            SuggestOfficerUnit,
            SuggestOfficerActive,
            SuggestAllegationCategoryCategory,
            SuggestAllegationCategoryCat,
            SuggestAllegationCategoryOnDuty,
            SuggestInvestigator,
            SuggestOutcome,
            SuggestFinding,
            SuggestArea,
            SuggestRaceGender,
            SuggestOfficerRank,
            SuggestOutcomeText,
            SuggestDataSource,
            SuggestRepeatOffenders,
            SuggestSessionAlias,
            SuggestHas,
            SuggestInvestigatorAgency,
        ]

    def _make_suggestion(self, q):
        suggestions = OrderedDict()
        q = q.strip()

        for suggest in self.suggests:
            group = suggest.query(q)
            if group:
                suggestions.update(group)

        suggestions = OrderedDict((k, v) for k, v in suggestions.items() if v)

        return suggestions

    def make_alias_suggestions(self, q):
        suggestions = OrderedDict()

        aliases = Alias.objects.filter(alias__istartswith=q)[0:10]

        for alias in aliases:
            suggestions = self._make_suggestion(alias.target)

            if not alias.num_suggestions:
                alias.num_suggestions = sum([len(v) for k, v in suggestions.items()])
            alias.num_usage += 1
            alias.save()

        return suggestions

    def make_suggestion(self, q):
        full_suggestions = self.make_alias_suggestions(q)
        suggestions = self._make_suggestion(q)

        for key in suggestions:
            if key in full_suggestions:
                full_suggestions[key] = full_suggestions[key] + suggestions[key]
            else:
                full_suggestions[key] = suggestions[key]

        return format_suggest(full_suggestions)
