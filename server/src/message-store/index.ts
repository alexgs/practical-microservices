/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { PgClient } from '../../lib';

import {
  CreateSubscriptionOptions,
  Subscription,
  createSubscriptionFactory,
} from './create-subscription-factory';
import { readerFactory } from './reader-factory';
import { WriteFn, writeFactory } from './write-factory';

export type JsonB = Record<string, unknown>;

export interface EventInput {
  id: string;
  type: string;
  metadata?: WinterfellEventMetadata;
  data: WinterfellEventData;
}

export interface MessageStore {
  createSubscription: (options: CreateSubscriptionOptions) => Subscription;
  write: WriteFn;
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
  const reader = readerFactory(pg);
  const write = writeFactory(pg);
  return {
    write,
    createSubscription: createSubscriptionFactory({
      write,
      read: reader.read,
      readLastMessage: reader.readLastMessage,
    }),
  };
}
