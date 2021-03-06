from django.db.models.query_utils import Q


class OfficerQuery(object):

    @staticmethod
    def condition_by_name(name, prefix=''):
        parts = name.split(' ')
        officer_first_key = '{prefix}officer_first__istartswith'.format(prefix=prefix)
        officer_last_key = '{prefix}officer_last__istartswith'.format(prefix=prefix)
        cond = Q(**{officer_first_key: name}) | Q(**{officer_last_key: name})
        if len(parts) > 1:
            cond = (Q(**{officer_last_key: " ".join(parts[1:])}) & Q(**{officer_first_key: parts[0]})) | cond

        return cond

    @staticmethod
    def condition_by_count(count, field, prefix='', direction='gt'):
        return Q(**{'{prefix}{field}__{direction}'.format(field=field, direction=direction, prefix=prefix): count})
