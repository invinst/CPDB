COPY common_policewitness (
    pwit_id,
    crid,
    officer_id,
    gender,
    race) FROM '/Users/eastagile/code/CPDB/test_data/data_pwit.csv' (DELIMITER ',', QUOTE '"', FORMAT 'csv');


