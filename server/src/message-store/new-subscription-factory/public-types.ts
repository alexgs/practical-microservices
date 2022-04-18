/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { QueryResult } from 'pg';

import { Startable } from '../../types';
import { Reader, WinterfellEvent, WriteFn } from '../types';

export type CreateSubscriptionFn = (options: CreateSubscriptionOptions) => Subscription;

export interface CreateSubscriptionOptions {
  handlers: Record<string, MessageHandler>;
  messagesPerTick?: number;
  // _originStreamName?: string | null;
  positionUpdateCount?: number;
  streamName: string;
  subscriberId: string;
  tickIntervalMs?: number;
}

export interface FactoryCrew {
  read: Reader['read'];
  readLastMessage: Reader['readLastMessage'];
  write: WriteFn;
}

export type MessageHandler = (event: WinterfellEvent) => Promise<unknown>;

export interface State {
  currentPosition: number;
  messagesSinceLastPositionUpdate: number;
  continuePolling: boolean;
  subscriberStreamName: string;
}

export interface Subscription extends Startable {
  loadPosition: () => Promise<void>;
  poll: () => void;
  savePosition: (position: number) => Promise<WriteResult>;
  stop: () => void;
}

export type WriteResult = QueryResult<{ write_message: number }>;
