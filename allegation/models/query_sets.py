from django.db import models
from django.db.models.sql.query import get_order_dir
from django.db.models.constants import LOOKUP_SEP
from django.db.models.sql.constants import ORDER_DIR
from django.core.exceptions import FieldError

from allegation.models.expressions import NullLastOrderBy


class NullLastOrderQuerySetMixin(object):
    def _find_ordering_name(
            self, name, opts, alias=None, default_order='ASC', already_seen=None):
        """
        Returns the table alias (the name might be ambiguous, the alias will
        not be) and column name for ordering by the given 'name' parameter.
        The 'name' is of the form 'field1__field2__...__fieldN'.

        Taken from `django.db.models.compiler.SQLCompiler` object.
        """
        name, order = get_order_dir(name, default_order)
        descending = True if order == 'DESC' else False
        pieces = name.split(LOOKUP_SEP)
        field, targets, alias, joins, path, opts = self._setup_joins(pieces, opts, alias)

        # If we get to this point and the field is a relation to another model,
        # append the default ordering for that model unless the attribute name
        # of the field is specified.
        if field.rel and path and opts.ordering and name != field.attname:
            # Firstly, avoid infinite loops.
            if not already_seen:
                already_seen = set()
            join_tuple = tuple(self.query.alias_map[j].table_name for j in joins)
            if join_tuple in already_seen:
                raise FieldError('Infinite loop caused by ordering.')
            already_seen.add(join_tuple)

            results = []
            for item in opts.ordering:
                results.extend(self._find_ordering_name(
                    self.query, item, opts, alias, order, already_seen))
            return results
        targets, alias, _ = self.query.trim_joins(targets, joins, path)
        return [NullLastOrderBy(t.get_col(alias), descending=descending) for t in targets]

    def _setup_joins(self, pieces, opts, alias):
        """
        A helper method for get_order_by and get_distinct.

        Taken from `django.db.models.compiler.SQLCompiler` object.
        """
        if not alias:
            alias = self.query.get_initial_alias()
        field, targets, opts, joins, path = self.query.setup_joins(
            pieces, opts, alias)
        alias = joins[-1]
        return field, targets, alias, joins, path, opts

    def null_last_order_by(self, *params):
        """
        This flips the behavior of `order_by` regarding null values.

        It will sort NULLS LAST if descending and NULLS FIRST otherwise.
        """
        expressions = []

        if self.query.standard_ordering:
            asc, _ = ORDER_DIR['ASC']
        else:
            asc, _ = ORDER_DIR['DESC']

        for field in params:
            expressions.extend(self._find_ordering_name(field, self.query.get_meta(), default_order=asc))

        return self.order_by(*expressions)


class AllegationQuerySet(models.query.QuerySet, NullLastOrderQuerySetMixin):
    def update(self, *args, **kwargs):
        if 'document_id' in kwargs and int(kwargs['document_id']) > 0:
            kwargs.setdefault('document_requested', False)
            kwargs.setdefault('document_pending', False)
        elif 'document_pending' in kwargs and \
                kwargs['document_pending'] is False:
            kwargs.setdefault('document_requested', True)
            kwargs.setdefault('document_id', 0)

        return super(AllegationQuerySet, self).update(*args, **kwargs)


class OfficerAllegationQuerySet(models.query.QuerySet, NullLastOrderQuerySetMixin):
    pass
