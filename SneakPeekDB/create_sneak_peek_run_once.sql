-- This should create the database and create the tables in it

-- Simulate CREATE DATABASE IF NOT EXISTS which isn't a thing.
-- \gexec executes every colum of every row of the results, if any, as a dynamic SQL statement.
-- In this case, we get the empty set if mint_db exists (\gexec does nothing in this case),
-- and we get "CREATE DATABASE mint_db; (one row, one column)" if mint_db doesn't exist
-- which \gexec then executes dynamically.
SELECT 'CREATE DATABASE sneak_peek_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'sneak_peek_db')\gexec
\c sneak_peek_db

\i create_sneak_peek_idempotent.sql