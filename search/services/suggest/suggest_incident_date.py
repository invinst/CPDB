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
                        suggest_value=entry,
                        tag_value=cls.build_tag_value(
                            category='incident_date_only__year_month',
                            value=entry,
                            display_category='Incident Year/Month',
                            display_value=entry,
                        )
                    ) for entry in raw_results
                ]
        else:
            year = None
            splitted = term.split(' ')
            month = splitted[0]
            if len(splitted) > 1:
                year = splitted[1]
            for m in month_choices():
                if m[1].lower().startswith(month):
                    raw_results = raw_results + generate_month_year_entry_from_2010(m, year)

                    results = [
                        cls.entry_format(
                            suggest_value=entry[0],
                            tag_value=cls.build_tag_value(
                                category='incident_date_only__year_month',
                                value=entry[1],
                                display_category='Incident Year/Month',
                                display_value=entry[1],
                            )
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
                    suggest_value=entry,
                    tag_value=cls.build_tag_value(
                        category='incident_date_only',
                        value=entry,
                        display_category='Incident Date',
                        display_value=entry,
                    )
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
                suggest_value=entry,
                tag_value=cls.build_tag_value(
                    category='incident_date_only__year',
                    value=entry,
                    display_category='Incident Year',
                    display_value=entry,
                )
            ) for entry in raw_results
        ]

        return {'Incident Year': results}
