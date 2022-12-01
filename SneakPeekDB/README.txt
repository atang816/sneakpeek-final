---Suggestions---

1) After getting Postgres create a super user as your same user for your computer
terminal: sudo -u postgres createuser --superuser <adrianperez>

2) Create a db with that same name *this will allow to use "psql" command in terminal without ever specifying user
terminal: createdb adrianperez

3) You should be able to type "psql" and this will open the db you just created
terminal: psql


---Steps to get database and its tables---

- You have db already created (use this if we ever start to add more tables and db functions)
1) in terminal connect to postgres within the sneak_peek_db directory or else you will have to provide full paths to script
e.g. terminal: psql

2) run script create_sneal_peek_idempotent.sql
e.g. adrianperez=# \i create_sneal_peek_idempotent.sql

3) if successful you'll see the tables created


- Don't have the db
1) in terminal connect to postgres within the sneak_peek_db directory or else you will have to provide full paths to script
e.g. terminal: psql

2) run script create_sneal_peek_run_once.sql
e.g. adrianperez=# \i create_sneal_run_once.sql

3) if successful you'll see the connect to db and the tables will be created


