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

    @classmethod
    def entry_format(cls, label, value, filter):
        return {
            'label': label,
            'value': value,
            'filter': filter
        }

    @classmethod
    def build_filter(cls, category, value):
        processed_value = value or 'null'
        return '{category}={value}'.format(category=category, value=processed_value)

    @classmethod
    def _query_database(cls, model_cls, condition, fields_to_get, limit=5, order_bys=None):
        flat = True if len(fields_to_get) == 1 else False
        queryset = model_cls.objects.filter(condition).values_list(*fields_to_get, flat=flat)
        if order_bys:
            queryset = queryset.order_by(*order_bys)
        queryset = queryset.distinct()[:limit]
        return list(queryset)
