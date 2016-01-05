from search.services.suggest import SuggestBase
from search.utils.date import START_SEARCHABLE_YEAR, generate_month_year_entry_from_2010, month_choices, current_year


class SuggestIncidentDateOnlyYearMonth(SuggestBase):
    @classmethod
    def _query(cls, term):
        results = []

        if term.count('/') == 1:
            year, month = term.split("/")

            if year.isnumeric():
                months = ["%02d" % x for x in range(1, 13)]

                results = ["%s/%s" % (year, x) for x in months if x.startswith(month)]
        else:
            for month in month_choices():
                if month[1].lower().startswith(term):
                    results = results + generate_month_year_entry_from_2010(month)

        return { 'suggest_incident_year_month': results }


class SuggestIncidentDateOnly(SuggestBase):
    @classmethod
    def active_condition(cls, term):
        return term.count('/') == 2

    @classmethod
    def _query(cls, term):
        year, month, day = term.split("/")

        if year.isnumeric() and month.isnumeric():
            days = ["%02d" % x for x in range(1, 32)]
            results = ["%s/%s/%s" % (year, month, x) for x in days if x.startswith(day)]

        return { 'incident_date_only': results }


class SuggestIncidentDateOnlyYear(SuggestBase):
    @classmethod
    def active_condition(cls, term):
        return term.count('/') == 0

    @classmethod
    def _query(cls, term):
        range_years = range(START_SEARCHABLE_YEAR, current_year() + 1)
        results = [x for x in range_years if str(x).startswith(term)]

        return { 'incident_date_only__year': results }
