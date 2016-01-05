class SuggestBase(object):
    class Meta:
        abstract = True

    @classmethod
    def query(cls, term):
        if cls.active_condition(term):
            return cls._query(term)

    @classmethod
    def active_condition(cls, term):
        return True

    @classmethod
    def suggest_in(cls, term, data):
        results = [[entry[1], entry[0]] for entry in data if cls._matched_query(entry[1], term)]

        return results

    @classmethod
    def _matched_query(cls, s, q):
        return str(q).lower() in str(s).lower()

    @classmethod
    def suggest_in_custom(cls, term, data):
        results = []
        for entry in data:
            text = data[entry]['text']
            if cls._matched_query(text, term):
                results.append([text, entry])

        return results

