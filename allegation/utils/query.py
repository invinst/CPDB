from django.db.models.query_utils import Q


class OfficerQuery(object):

    @staticmethod
    def condition_by_name(name, prefix=''):
        parts = name.split(' ')
        officer_first_key = '{prefix}officer_first__istartswith'.format(prefix=prefix)
        officer_last_key = '{prefix}officer_last__istartswith'.format(prefix=prefix)
        if len(parts) > 1:
            cond = Q(**{officer_first_key: parts[0]})
            cond = cond & Q(**{officer_last_key: " ".join(parts[1:])})
        else:
            cond = Q(**{officer_first_key: name}) | Q(**{officer_last_key: name})
        return cond
