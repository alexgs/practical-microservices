# Database

## Message DB

To initially install [Message DB][2], I performed the following steps:

1. Clone the git repo to `host/database`.
1. Use `task db:shell` to get a shell on the running Docker container.
1. Do `cd /host/message-db/database`.
1. Run `PGUSER=<user> PGPASSWORD=<password> ./install.sh`. The message store needs to be created in its own database
1. Use [pgAdmin][3] to delete the `public` schema in the `message_store` database.
1. Use [pgAdmin][3] to rename the `message_store` schema in the `message_store` database to `public`.

The use of environment variables allows the same configuration options as passing flags to `psql` on the command line but without having to modify all of the scripts ([full reference][1]). Using `PGPASSWORD` to set the password is recommended, as it saves a lot of annoying copy-and-paste.

[1]: https://www.postgresql.org/docs/current/libpq-envars.html
[2]: https://github.com/message-db/message-db
[3]: https://www.pgadmin.org/

## Passwords generally

You can set credentials for `psql` generally with a [`.pgpass` file][4].

[4]: https://www.postgresql.org/docs/13/libpq-pgpass.html
