class SuggestBase(object):
    @classmethod
    def active_condition(cls, term):
        return True

    @classmethod
    def query(cls, term):
        if cls.active_condition(term):
            return cls._query(term)

    @classmethod
    def _query(cls, term):
        raise NotImplementedError

    @classmethod
    def _matched_query(cls, s, q):
        return str(q).lower() in str(s).lower()

    @classmethod
    def suggest_in(cls, term, data):
        results = [[entry[1], entry[0]] for entry in data if cls._matched_query(entry[1], term)]

        return results

    @classmethod
    def suggest_in_custom(cls, term, data):
        results = []
        for entry in data:
            text = data[entry]['text']
            if cls._matched_query(text, term):
                results.append([text, entry])

        return results

    @classmethod
    def entry_format(cls, suggest_value, tag_value):
        return {
            'suggest_value': suggest_value,
            'tag_value': tag_value
        }

    @classmethod
    def build_tag_value(cls, category, value, display_category, display_value):
        if value is None:
            processed_value = 'null'
        else:
            processed_value = value

        tag_value = {
            'category': category,
            'value': processed_value,
            'display_category': display_category,
            'display_value': display_value
        }
        return tag_value
