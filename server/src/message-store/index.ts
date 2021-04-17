/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { QueryResult } from 'pg';

import { PgClient } from '../../lib';

import {
  CreateSubscriptionOptions,
  Subscription,
  createSubscriptionFactory,
} from './create-subscription-factory';
import { writeFactory } from './write-factory';

export type JsonB = Record<string, unknown>;

export interface EventInput {
  id: string;
  type: string;
  metadata: WinterfellEventMetadata;
  data: WinterfellEventData;
}

export interface MessageStore {
  createSubscription: (options: CreateSubscriptionOptions) => Subscription;
  write: (
    streamName: string,
    message: EventInput,
    expectedVersion?: number | null,
  ) => Promise<QueryResult>;
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

export function createMessageStore(pg: PgClient): MessageStore {
  return {
    createSubscription: createSubscriptionFactory(),
    write: writeFactory(pg),
  };
}
