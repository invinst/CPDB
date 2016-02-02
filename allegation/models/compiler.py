from django.db.models.sql.compiler import SQLCompiler


class NullsLastSQLCompiler(SQLCompiler):
    def get_order_by(self):
        results = super(NullsLastSQLCompiler, self).get_order_by()
        if self.connection.vendor == 'postgresql' and results:
            return [(result[0], (
                result[1][0].replace('DESC', 'DESC NULLS LAST').replace('ASC', 'ASC NULLS FIRST'),
                result[1][1], result[1][2])) for result in results]
        return results
