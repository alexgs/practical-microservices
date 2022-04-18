/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { MessageDatabase } from '../../../lib';
import { ALL_EVENTS_STREAM, isEntityStream } from '../index';
import { WinterfellEvent, Reader } from '../types';

// TODO Refactor so the worker functions and their tests are in separate files

/** @internal */
export const SQL = {
  READ_ALL_EVENTS: 'SELECT * FROM messages WHERE global_position > $1 LIMIT $2',
  READ_CATEGORY_STREAM: 'SELECT * FROM get_category_messages($1, $2, $3)',
  READ_ENTITY_STREAM: 'SELECT * FROM get_stream_messages($1, $2, $3)',
  READ_LAST_MESSAGE: 'SELECT * FROM get_last_stream_message($1)',
};

/** @internal */
export async function readAllEvents(
  pg: MessageDatabase,
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
  pg: MessageDatabase,
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
  pg: MessageDatabase,
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
export function readerFactory(pg: MessageDatabase): Reader {
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
  ): Promise<WinterfellEvent | null> {
    const result = await pg.query<WinterfellEvent>(SQL.READ_LAST_MESSAGE, [
      streamName,
    ]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
  }

  return {
    read,
    readLastMessage,
  };
}
