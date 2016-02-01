from search.services.suggest import SuggestBase


class SuggestInvestigatorAgency(SuggestBase):
    @classmethod
    def active_condition(cls, term):
        return term.startswith('i')

    @classmethod
    def _query(cls, term):
        ret = []
        for agency in ['IAD', 'IPRA']:
            if agency.lower().startswith(term):
                ret.append(
                    cls.entry_format(
                        suggest_value=agency,
                        tag_value=cls.build_tag_value(
                            category='allegation__investigator__agency',
                            value=agency,
                            display_category='Investigation Agency',
                            display_value=agency,
                        )
                    )
                )

        return {'Investigation Agency': ret}
