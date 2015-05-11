COPY common_complainingwitness (
	cwit_id,
    crid,
    gender,
    race) FROM '/Users/eastagile/code/CPDB/test_data/data_cwit.csv' (DELIMITER ',', QUOTE '"', FORMAT 'csv');


