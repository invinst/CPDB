#!/bin/bash

/etc/init.d/supervisor start
supervisorctl reread
supervisorctl start all
#supervisorctl start cpdb
cd /code/
npm install
npm run build
./manage.py migrate
./manage.py bower_install
cp allegation/static/allegation/js/bundle.min.js allegation/static/allegation/js/bundle.js
./manage.py collectstatic --noinput
service nginx start
/code/start_gunicorn.sh
