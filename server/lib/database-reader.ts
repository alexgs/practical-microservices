/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import knex, { Knex } from 'knex';

type DatabaseReader = Knex;

async function createDatabaseReader(
  connectionString: string,
  migrationsTable = 'knex_migrations'
): Promise<DatabaseReader> {
  const client = knex(connectionString);
  await client.migrate.latest({ tableName: migrationsTable });

  return client;
}

export { DatabaseReader, createDatabaseReader };
