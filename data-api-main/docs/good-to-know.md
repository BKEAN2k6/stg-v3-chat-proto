### Directus

- You can run database related actions (`bootstrap`, `schema apply` or `schema snapshot`) locally against a remote database by changing the `DB_CONNECTION_STRING`, `KEY` and `SECRET` in the relevant `directus.config.*.js` file to match the ones used when the remote database was set up.

- You can get direct access to the cloud database through the fly.io instance:
  - `flyctl ssh console -a stg-staging` (NOTE: use --select to pick an instance if there are multiple)
  - `apt update && apt install -y curl gpg`
  - `echo "deb [signed-by=/usr/share/keyrings/postgresql-keyring.gpg] http://apt.postgresql.org/pub/repos/apt/ bullseye-pgdg main" | tee /etc/apt/sources.list.d/postgresql.list`
  - `curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /usr/share/keyrings/postgresql-keyring.gpg`
  - `apt update && apt -y install postgresql-14`
  - `psql -d $DATABASE_URL`
  - `pg_dump -d $DATABASE_URL > dump.sql`

- Dump can then be cloned to a local machine with:
  - `flyctl sftp get -a stg-staging /data-api/dump.sql ./dump.sql`
  - NOTE: use --select to pick an instance if there are multiple
  - NOTE: be sure to remove the dump file from the machine after it's copied over

- If database needs to be recreated from scratch, you can rerun the database creation on next deployment by running these against the database (REMOVES ALL DATA!!!):
  - `DROP SCHEMA public CASCADE;`
  - `CREATE SCHEMA public;`
  - NOTE: after this is done, and a new deployment goes through successfully, we still need to run the seeding and setting the admin password with 
   - `cd data-api; yarn seed -i --directusUrl https://stg-staging.fly.dev --superAdminPass PASS1 --newAdminPass PASS2`

### Fly

- You can access the remote database by proxying to a local port with: `flyctl -t $TOKEN proxy 15432:5432 -s -a $APP_NAME-db`