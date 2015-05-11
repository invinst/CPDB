COPY common_officer (
    officer_first,
    officer_last,
    gender,
    race,
    appt_date,
    unit,
    rank,
    star) FROM '/Users/eastagile/code/CPDB/data_cat.csv' (DELIMITER ',', QUOTE '"', FORMAT 'csv');


