/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { PgClient } from './database-client';

export type WinterfellEventData = JsonB;

export interface EventInput {
  id: string;
  type: string;
  metadata: WinterfellEventMetadata;
  data: WinterfellEventData;
}

export interface WinterfellEvent extends EventInput {
  global_position: number;
  position: number;
  stream_name: string;
}

export interface WinterfellEventMetadata extends JsonB {
  traceId: string;
  userId: number;
}

const SQL_FN = {
  WRITE: 'SELECT write_message($1, $2, $3, $4, $5, $6)',
};

type JsonB = Record<string, unknown>;
type WriteValues = [string, string, string, JsonB, JsonB, number | null];
export type MessageStore = ReturnType<typeof createMessageStore>;

interface CreateSubscriptionOptions {
  // eslint-disable-next-line @typescript-eslint/ban-types
  handlers: Record<string, Function>,
  streamName: string;
  subscriberId: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createMessageStore(pg: PgClient) {
  return {
    createSubscription: (options: CreateSubscriptionOptions) => {
      return { start: () => null };
    },
    write: async (streamName: string, message: EventInput, expectedVersion: number | null = null) => {
      const values: WriteValues = [
        message.id,
        streamName,
        message.type,
        message.data,
        message.metadata,
        expectedVersion,
      ];
      return pg.query(SQL_FN.WRITE, values);
    },
  }
}
