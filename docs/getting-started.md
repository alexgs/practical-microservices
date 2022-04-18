# Getting started

So you just checked out this repo? Here's how to get started with development.

1. Create a `.env` file in the project root with the following format:

```dotenv
DATABASE_ADMIN_PASSWORD=
DATABASE_ADMIN_USER=
DATABASE_NAME=
DATABASE_PASSWORD=
DATABASE_USER=
DATABASE_HOST_DIRECTORY=
DATABASE_PORT=
SERVER_PORT=

# Expanded env vars (this works just fine with Docker Compose and Taskfile)
DATABASE_URL=postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@database:5432/${DATABASE_NAME}
MESSAGE_STORE_URL=${DATABASE_URL}
```

2. (Optional) Create or update a [`.pgpass` file][1].

[1]: https://www.postgresql.org/docs/13/libpq-pgpass.html

3. Run `task db:DANGEROUS:initialize`
4. Run `task up` to start the application stack. You can verify that everything is okay with Postgres by checking the logs with `docker-compose logs -f database`.
5. Clone the [Message DB][2] git repo to `host/database`.

[2]: https://github.com/message-db/message-db

6. Use `task db:shell` to get a shell on the running Docker container.
7. Do `cd /host/message-db/database`.
8. Manually substitute env vars and run `PGUSER=${DATABASE_ADMIN_USER} PGPASSWORD=${DATABASE_ADMIN_PASSWORD} ./install.sh`. The message store needs to be created in its own database.
9. Change the `.env` file so that `DATABASE_NAME=message_store`.
10. Connect to the cluster from the host, `task db:psql-admin` (or `psql -h localhost -p $DATABASE_PORT -U $DATABASE_ADMIN_USER -d $DATABASE_NAME`). As with subsequent commands, you will be prompted for `$DBADMIN_PASSWORD`. You can set up a [`.pgpass` file][1] to bypass the password prompt.
11. Execute the following queries (manually substituting values for the env vars):

```sql
CREATE ROLE $DATABASE_USER
  WITH LOGIN PASSWORD '$DATABASE_PASSWORD';

REVOKE ALL ON DATABASE $DATABASE_NAME
  FROM $DATABASE_USER;

-- "Create" privilege is required for installing extensions in Flyway migrations
GRANT CONNECT, CREATE ON DATABASE $DATABASE_NAME
  TO $DATABASE_USER;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;

GRANT ALL ON ALL TABLES IN SCHEMA public TO $DATABASE_USER;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DATABASE_USER;

ALTER ROLE $DATABASE_USER WITH CREATEDB;

REVOKE ALL ON ALL TABLES IN SCHEMA message_store FROM PUBLIC;

GRANT ALL ON SCHEMA message_store TO $DATABASE_USER;

GRANT ALL ON ALL SEQUENCES IN SCHEMA message_store TO $DATABASE_USER;

ALTER DEFAULT PRIVILEGES IN SCHEMA message_store GRANT ALL ON SEQUENCES TO $DATABASE_USER;

ALTER DEFAULT PRIVILEGES IN SCHEMA message_store GRANT ALL ON TABLES TO $DATABASE_USER;
```

Note: To be honest, I'm not sure exactly which of the `SCHEMA message_store` statements are critical. Some of them may be unnecessary. :shrug:

12. Use `\q` to exit the client.
13. Run `rm ~/.psql_history` to clear the client history (which contains the `$DATABASE_PASSWORD`).
14. Download the source files from the [book's website][3] and copy the files from `video-tutorials/src/app/public` to this projects `server/public` directory.

[3]: https://pragprog.com/titles/egmicro/practical-microservices/
