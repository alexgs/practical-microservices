/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { QueryResult } from 'pg';

import { PgClient } from '../../lib';

import { EventInput, JsonB } from './index';

type WriteValues = [string, string, string, JsonB, JsonB, number | null];

const SQL_WRITE_FN = 'SELECT write_message($1, $2, $3, $4, $5, $6)';

export function writeFactory(pg: PgClient) {
  return async function write(
    streamName: string,
    message: EventInput,
    expectedVersion: number | null = null,
  ): Promise<QueryResult> {
    const values: WriteValues = [
      message.id,
      streamName,
      message.type,
      message.data,
      message.metadata,
      expectedVersion,
    ];
    return pg.query(SQL_WRITE_FN, values);
  };
}
