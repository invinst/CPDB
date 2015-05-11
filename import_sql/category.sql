COPY common_allegationcategory (
    cat_id,
    category,
    allegation_name) FROM '/Users/eastagile/code/CPDB/data_cat.csv' (DELIMITER ',', QUOTE '"', FORMAT 'csv');


