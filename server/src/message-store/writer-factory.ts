/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { QueryResult } from 'pg';

import { MessageDatabase } from '../../lib';

import { EventInput, JsonB } from './index';
import { WriteFn } from './types';

type WriteValues = [string, string, string, JsonB, JsonB | null, number | null];

const SQL_WRITE_FN = 'SELECT write_message($1, $2, $3, $4, $5, $6)';

export function writerFactory(db: MessageDatabase): WriteFn {
  // TODO Refactor this so there's a `writer` object, so the syntax here parallels what's in `reader-factory`
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
      message.metadata ?? null,
      expectedVersion,
    ];
    return db.query<{write_message: number}>(SQL_WRITE_FN, values);
    // TODO Add error handling (see https://learning.oreilly.com/library/view/practical-microservices/9781680507782/f_0051.xhtml)
  };
}
