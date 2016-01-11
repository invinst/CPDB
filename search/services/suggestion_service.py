from collections import OrderedDict

from search.models.alias import Alias
from search.services.suggest_format_service import SuggestFormatService
from search.services.suggest.suggest_incident_date import SuggestIncidentDateOnlyYearMonth, SuggestIncidentDateOnly, SuggestIncidentDateOnlyYear
from search.services.suggest.suggest_allegation import SuggestAllegationCity, SuggestAllegationCrid
from search.services.suggest.suggest_allegation_category import SuggestAllegationCategoryCategory, SuggestAllegationCategoryCat
from search.services.suggest.suggest_area import SuggestArea
from search.services.suggest.suggest_has import SuggestHas
from search.services.suggest.suggest_investigator import SuggestInvestigator
from search.services.suggest.suggest_officer import SuggestOfficerName, SuggestOfficerStar, SuggestOfficerUnit, SuggestOfficerRank
from search.services.suggest.suggest_session_alias import SuggestSessionAlias
from search.services.suggest.suggest_data_source import SuggestDataSource
from search.services.suggest.suggest_outcome import SuggestOutcome, SuggestOutcomeText
from search.services.suggest.suggest_race_gender import SuggestRaceGender
from search.services.suggest.suggest_repeat_offenders import SuggestRepeatOffenders
from search.services.suggest.suggest_finding import SuggestFinding


class SuggestionService(object):
    def __init__(self):
        self.suggests = [
            SuggestIncidentDateOnlyYearMonth,
            SuggestIncidentDateOnly,
            SuggestIncidentDateOnlyYear,
            SuggestAllegationCity,
            SuggestAllegationCrid,
            SuggestAllegationCategoryCategory,
            SuggestAllegationCategoryCat,
            SuggestArea,
            SuggestHas,
            SuggestInvestigator,
            SuggestOfficerName,
            SuggestOfficerStar,
            SuggestOfficerUnit,
            SuggestOfficerRank,
            # SuggestSessionAlias,
            SuggestDataSource,
            SuggestOutcome,
            SuggestOutcomeText,
            SuggestRepeatOffenders,
            SuggestRaceGender,
            SuggestFinding
        ]

    def _make_suggestion(self, q):
        ret = {}
        for suggest in self.suggests:
            group = suggest.query(q)
            if group:
                ret.update(group)

        ret = OrderedDict((k, v) for k, v in ret.items() if v)

        return ret

    def make_suggestion(self, q):
        aliases = Alias.objects.filter(alias__istartswith=q)[0:10]

        ret = OrderedDict()
        for alias in aliases:
            ret = self._make_suggestion(alias.target)

            if not alias.num_suggestions:
                alias.num_suggestions = sum([len(v) for k, v in ret.items()])
            alias.num_usage += 1
            alias.save()

        ret_append = self._make_suggestion(q)

        for key in ret_append:
            if key in ret:
                ret[key] = ret[key] + ret_append[key]
            else:
                ret[key] = ret_append[key]

        ret = SuggestFormatService().format(ret)

        return ret
