class SqlHelper(object):
    @staticmethod
    def array_as_sql(items=[]):
        return ','.join("'{}'".format(item) for item in items)

    @staticmethod
    def len_of_raw_queryset(raw_queryset):
        # Do not overuse this method, its purpose only for testing
        return sum(1 for _ in raw_queryset)
