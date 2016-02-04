#!/bin.bash

echo "DELETE FROM django_migrations WHERE app in ('common', 'officer', 'api');" | psql cpdb_staging
./manage.py migrate common 0001 --fake
./manage.py migrate officer 0001 --fake
./manage.py migrate api 0001 --fake