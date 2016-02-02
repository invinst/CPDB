from django.db import models, connections

from allegation.models.compiler import NullsLastSQLCompiler


class NullsLastQuery(models.sql.query.Query):
    """
    Query that uses custom compiler,
    to utilize PostgreSQL feature of setting position of NULL records
    """
    def get_compiler(self, using=None, connection=None):
        if using is None and connection is None:
            raise ValueError("Need either using or connection")
        if using:
            connection = connections[using]

        return NullsLastSQLCompiler(self, connection, using)
