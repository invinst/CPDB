COPY common_officer (
	id,
    officer_first,
    officer_last,
    gender,
    race,
    appt_date,
    unit,
    rank,
    star) FROM '/Users/eastagile/code/CPDB/test_data/data_officer.csv' (DELIMITER ',', QUOTE '"', FORMAT 'csv');


