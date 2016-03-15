# CPDB

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

# Pre-deploy

Place any shell commands into the pre_deploy.sh. These will run once per deploy (by checking timestamps). After deploy
remember to blank out the file in the develop branch so that it is empty again and available for any pre_deploy commands

# Gulp commands

- `gulp build`: build everything, only use this command on production.
- `gulp dev`: watch and compile js/sass files when necessary.
