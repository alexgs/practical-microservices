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
