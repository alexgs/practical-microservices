/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { PgClient } from '../../lib';

import { WinterfellEvent } from './index';

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

/** @public */
export function readerFactory(pg: PgClient): Reader {
  async function read(
    streamName: string,
    fromPosition = 0,
    maxMessages = 1000,
  ): Promise<WinterfellEvent[]> {}

  async function readLastMessage(
    streamName: string,
  ): Promise<WinterfellEvent> {}

  return {
    read,
    readLastMessage,
  };
}
