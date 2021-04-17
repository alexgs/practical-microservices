# Database

## Message DB

To initially install [Message DB][2], I performed the following steps (these can probably be altered somewhat in the future for convenience or speed):

1. Clone the git repo to `host/database`.
1. Use `task db:shell` to get a shell on the running Docker container.
1. Do `cd /host/message-db/database`.
1. Run `PGUSER=<user> PGPASSWORD=<password> DATABASE_NAME=db_winterfell CREATE_DATABASE=off ./install.sh`.

The use of environment variables allows the same configuration options as passing flags to `psql` on the command line but without having to modify all of the scripts ([full reference][1]). Using `PGPASSWORD` to set the password is recommended, as it saves a lot of annoying copy-and-paste.

[1]: https://www.postgresql.org/docs/current/libpq-envars.html
[2]: https://github.com/message-db/message-db
