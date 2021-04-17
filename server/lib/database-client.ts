// TypeScript support for `node-postgres` seems to be kind of crap (or uses a
//   lot of generics), so turn off a bunch of warnings in this file.
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { PrismaClient } from '@prisma/client';
import * as env from 'env-var';
import { Pool, QueryResult } from 'pg';

const DATABASE_URL = env.get('DATABASE_URL').required().asString();
const postgresPool = new Pool({ connectionString: DATABASE_URL });

export type DbClient = PrismaClient;

export const db = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/require-await
export async function query(text: string, params: string[]): Promise<QueryResult> {
  return postgresPool.query(text, params);
}
