/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { PgClient } from '../../lib';

import { ALL_EVENTS_STREAM, WinterfellEvent, isEntityStream } from './index';

export interface Reader {
  read: (
    streamName: string,
    fromPosition?: number,
    maxMessages?: number,
  ) => Promise<WinterfellEvent[]>;
  readLastMessage: (streamName: string) => Promise<WinterfellEvent>;
}

/** @internal */
export const SQL = {
  READ_ALL_EVENTS: 'SELECT * FROM messages WHERE global_position > $1 LIMIT $2',
  READ_CATEGORY_STREAM: 'SELECT * FROM get_category_messages($1, $2, $3)',
  READ_ENTITY_STREAM: 'SELECT * FROM get_stream_messages($1, $2, $3)',
};

/** @internal */
export async function readAllEvents(
  pg: PgClient,
  fromPosition = 0,
  maxMessages = 1000,
): Promise<WinterfellEvent[]> {
  const result = await pg.query<WinterfellEvent>(SQL.READ_ALL_EVENTS, [
    fromPosition,
    maxMessages,
  ]);
  return result.rows;
}

/** @internal */
export async function readCategoryStream(
  pg: PgClient,
  streamName: string,
  fromPosition = 0,
  maxMessages = 1000,
): Promise<WinterfellEvent[]> {
  const result = await pg.query<WinterfellEvent>(SQL.READ_CATEGORY_STREAM, [
    streamName,
    fromPosition,
    maxMessages,
  ]);
  return result.rows;
}

/** @internal */
export async function readEntityStream(
  pg: PgClient,
  streamName: string,
  fromPosition = 0,
  maxMessages = 1000,
): Promise<WinterfellEvent[]> {
  const result = await pg.query<WinterfellEvent>(SQL.READ_ENTITY_STREAM, [
    streamName,
    fromPosition,
    maxMessages,
  ]);
  return result.rows;
}

/** @public */
export function readerFactory(pg: PgClient): Reader {
  async function read(
    streamName: string,
    fromPosition = 0,
    maxMessages = 1000,
  ): Promise<WinterfellEvent[]> {
    if (streamName === ALL_EVENTS_STREAM) {
      return readAllEvents(pg, fromPosition, maxMessages);
    }
    if (isEntityStream(streamName)) {
      return readEntityStream(pg, streamName, fromPosition, maxMessages);
    }
    return readCategoryStream(pg, streamName, fromPosition, maxMessages);
  }

  async function readLastMessage(
    streamName: string,
  ): Promise<WinterfellEvent> {}

  return {
    read,
    readLastMessage,
  };
}
