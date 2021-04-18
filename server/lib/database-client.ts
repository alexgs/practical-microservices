/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

// TypeScript support for `node-postgres` seems to be kind of crap (or uses a
//   lot of generics), so turn off a bunch of warnings in this file.
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { PrismaClient } from '@prisma/client';
import * as env from 'env-var';
import { Pool, QueryResult } from 'pg';

// --- POSTGRESQL ---

const MESSAGE_STORE_URL = env.get('MESSAGE_STORE_URL').required().asString();
const postgresPool = new Pool({ connectionString: MESSAGE_STORE_URL });

// eslint-disable-next-line @typescript-eslint/require-await
async function query<R>(text: string, params: unknown[]): Promise<QueryResult<R>> {
  return postgresPool.query<R>(text, params);
}

export const pg = { query };
export type PgClient = typeof pg;

// --- PRISMA ---

export type DbClient = PrismaClient;

export const db = new PrismaClient();
