#!/bin.bash

echo "SELECT pg_terminate_backend(pg_stat_activity.pid) from pg_stat_activity where datname = 'cpdb_staging’;" > psql cpdb; dropdb cpdb_staging; createdb cpdb_staging; pg_dump cpdb | psql cpdb_staging;
./manage capitalize_officer_name
