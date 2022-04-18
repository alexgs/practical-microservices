/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { QueryResult } from 'pg';

export interface EventInput {
  id: string;
  type: string;
  metadata?: WinterfellEventMetadata;
  data: WinterfellEventData;
}

export type JsonB = Record<string, unknown>;

export interface Reader {
  read: (
    streamName: string,
    fromPosition?: number,
    maxMessages?: number,
  ) => Promise<WinterfellEvent[]>;
  readLastMessage: (streamName: string) => Promise<WinterfellEvent | null>;
}

export type WinterfellEventData = JsonB;

export interface WinterfellEvent extends EventInput {
  global_position: number;
  position: number;
  stream_name: string;
}

export interface WinterfellEventMetadata extends JsonB {
  traceId: string;
  userId: number;
}

export type WriteFn = (
  streamName: string,
  message: EventInput,
  expectedVersion?: number | null,
) => WriteResult;

export type WriteResult = Promise<QueryResult<{write_message: number}>>;
