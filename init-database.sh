#!/bin/bash
set -e

echo 'Running init-database script'

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER docker;
    CREATE DATABASE chegados;
    GRANT ALL PRIVILEGES ON DATABASE chegados TO docker;
    CREATE DATABASE my_project_test;
    GRANT ALL PRIVILEGES ON DATABASE my_project_test TO docker;
EOSQL
