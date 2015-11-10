#!/bin/bash

psql cpdb -Atq -f fixsequence.sql -o temp
psql cpdb -f temp
rm temp
