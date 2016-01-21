from django.db.models.expressions import OrderBy


class NullLastOrderBy(OrderBy):
    template = '%(expression)s %(ordering)s %(null_ordering)s'

    @property
    def null_last(self):
        return self.descending

    def __repr__(self):
        return "{}({}, descending={}, null_last={})".format(
            self.__class__.__name__, self.expression, self.descending, self.null_last)

    def as_postgresql(self, compiler, connection):
        connection.ops.check_expression_support(self)
        expression_sql, params = compiler.compile(self.expression)
        placeholders = {'expression': expression_sql}
        placeholders['ordering'] = 'DESC' if self.descending else 'ASC'
        placeholders['null_ordering'] = 'NULLS LAST' if self.null_last else 'NULLS FIRST'
        return (self.template % placeholders).rstrip(), params
