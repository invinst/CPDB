# CPDB: The Citizens Police Data Project

This is the open source code for the [Citizens Police Data
Project](https://CPDB.co/) ([CPDB.co](https://CPDB.co/)) web site, an
interactive repository of formal complaints registered against Chicago
police offers.  More information about the
[history](https://cpdb.co/story/) and
[methods](https://cpdb.co/method/) of the project are available at the
site.  This code is regularly deployed to production once per week,
usually on Monday night or by sunrise on Tuesday.

We publish this code in order to practice the same transparency we
advocate for police departments, and in the hopes that it will be
useful for other jurisdictions.  We welcome contributions and
improvements; please use the issue tracker to ask questions, and use
[pull requests](https://help.github.com/articles/using-pull-requests/)
to suggest changes to the code or documentation.

**NOTE: The rest of this documentation is still quite incomplete.**

To make use of the instructions, you'll need a copy of the data.
(TODO: is it [here](http://invisible.institute/police-data/) or
[here](https://github.com/invinst/sworn-officer-import)?  Not sure;
need to find out and document accordingly...)

## After import new data, these commands need to be run

```
python manage.py fix_final_finding_null
python manage.py set_final_outcome
python manage.py calculate_allegations_count
python manage.py capitalize_officer_name
python manage.py get_allegation_date_only
python manage.py investigator_summary
python manage.py update_documents
```

## Pre-deploy

Place any shell commands into the pre_deploy.sh. These will run once per deploy (by checking timestamps). After deploy
remember to blank out the file in the develop branch so that it is empty again and available for any pre_deploy commands

## Gulp commands

- `gulp build`: build everything, only use this command on production.
- `gulp watch_{app}`: watch over and compile js/sass files of the app (allegation, dashboard, mobile) when necessary.
