COPY common_officerhistory (
    officer_id,
    unit,
    rank,
    star,
    as_of) FROM '/Users/eastagile/code/CPDB/test_data/data_officer_hist.csv' (DELIMITER ',', QUOTE '"', FORMAT 'csv');


