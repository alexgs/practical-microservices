/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { QueryResult } from 'pg';

import { Startable } from '../../types';
import { Reader, WinterfellEvent, WriteFn } from '../types';

export type CreateSubscriptionFn = (crew: FactoryCrew) => (options: CreateSubscriptionOptions) => Subscription;

export interface CreateSubscriptionOptions {
  handlers: Record<string, MessageHandler>;
  messagesPerTick?: number;
  // _originStreamName?: string | null;
  positionUpdateIntervalMs?: number;
  streamName: string;
  subscriberId: string;
  tickIntervalMs?: number;
}

export interface FactoryCrew {
  read: Reader['read'];
  readLastMessage: Reader['readLastMessage'];
  write: WriteFn;
}

/** @internal */
export type FinalOptions = Readonly<Required<CreateSubscriptionOptions>>;

export type MessageHandler = (event: WinterfellEvent) => Promise<unknown>;

export interface Subscription extends Startable {
  getPosition: () => Promise<number>;
  poll: () => void;
  savePosition: (position: number) => WriteResult;
  stop: () => void;
}

export type WriteResult = Promise<QueryResult<{write_message: number}>>;
