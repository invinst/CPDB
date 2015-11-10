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