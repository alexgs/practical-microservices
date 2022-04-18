/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import knex, { Knex } from 'knex';

export type ViewDatabase = Knex;

export async function createViewDbClient(
  connectionString: string,
  migrationsTable = 'knex_migrations'
): Promise<ViewDatabase> {
  const client = knex(connectionString);
  await client.migrate.latest({ tableName: migrationsTable });

  return client;
}
