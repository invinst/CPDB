from search.services.suggest import SuggestBase
from search.utils.date import START_SEARCHABLE_YEAR, generate_month_year_entry_from_2010, month_choices, current_year


class SuggestIncidentDateOnlyYearMonth(SuggestBase):
    @classmethod
    def _query(cls, term):
        raw_results = []
        results = []

        if term.count('/') == 1:
            year, month = term.split("/")

            if year.isnumeric() and int(year) > START_SEARCHABLE_YEAR:
                months = ["%02d" % x for x in range(1, 13)]

                raw_results = ["%s/%s" % (year, x) for x in months if x.startswith(month)]

                results = [
                    cls.entry_format(
                        label=entry,
                        value=entry,
                        filter=cls.build_filter(category='incident_date_only__year_month', value=entry)
                    ) for entry in raw_results
                ]
        else:
            for month in month_choices():
                if month[1].lower().startswith(term):
                    raw_results = raw_results + generate_month_year_entry_from_2010(month)

                    results = [
                        cls.entry_format(
                            label=entry[0],
                            value=entry[1],
                            filter=cls.build_filter(category='incident_date_only__year_month', value=entry[1])
                        ) for entry in raw_results
                    ]

        return {'Incident Year/Month': results}


class SuggestIncidentDateOnly(SuggestBase):
    @classmethod
    def active_condition(cls, term):
        return term.count('/') == 2

    @classmethod
    def _query(cls, term):
        year, month, day = term.split("/")

        if year.isnumeric() and month.isnumeric():
            days = ["%02d" % x for x in range(1, 32)]
            raw_results = ["%s/%s/%s" % (year, month, x) for x in days if x.startswith(day)]

            results = [
                cls.entry_format(
                    label=entry,
                    value=entry,
                    filter=cls.build_filter(category='incident_date_only', value=entry)
                ) for entry in raw_results
            ]

            return {'Incident Date': results}


class SuggestIncidentDateOnlyYear(SuggestBase):
    @classmethod
    def active_condition(cls, term):
        return term.count('/') == 0

    @classmethod
    def _query(cls, term):
        range_years = range(START_SEARCHABLE_YEAR, current_year() + 1)
        raw_results = [x for x in range_years if str(x).startswith(term)]

        results = [
            cls.entry_format(
                label=entry,
                value=entry,
                filter=cls.build_filter(category='incident_date_only__year', value=entry)
            ) for entry in raw_results
        ]

        return {'Incident Year': results}
