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
                        label=agency,
                        value=agency,
                        filter=cls.build_filter(category='allegation__investigator__agency', value=agency)
                    )
                )
        return {
            'Investigation Agency': ret}
