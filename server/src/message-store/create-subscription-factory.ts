/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { v4 as generateUuid } from 'uuid';

import { Startable } from '../types';

import { EventInput, WinterfellEvent } from './index';
import { WriteFn, WriteResult } from './write-factory';

export interface CreateSubscriptionOptions {
  // eslint-disable-next-line @typescript-eslint/ban-types
  handlers: Record<string, Function>;
  messagesPerTick?: number;
  originStreamName?: string | null;
  positionUpdateIntervalMs?: number;
  streamName: string;
  subscriberId: string;
  tickIntervalMs?: number;
}

export interface FactoryConfig {
  read: (
    streamName: string,
    fromPosition?: number,
    maxMessages?: number,
  ) => Promise<WinterfellEvent[]>;
  readLastMessage: (streamName: string) => Promise<WinterfellEvent>;
  write: WriteFn;
}

export interface Subscription extends Startable {
  getPosition: () => Promise<number>;
  savePosition: (position: number) => WriteResult;
  stop: () => void;
  tick: () => void;
}

export function createSubscriptionFactory(config: FactoryConfig) {
  return function createSubscription(
    options: CreateSubscriptionOptions,
  ): Subscription {
    const subscriberStreamName = `subscriberPosition-${options.subscriberId}`;
    let currentPosition = 0;
    let messagesSinceLastPositionSave = 0;
    let keepGoing = true;

    const finalOptions: Readonly<Required<CreateSubscriptionOptions>> = {
      messagesPerTick: 100,
      positionUpdateIntervalMs: 100,
      originStreamName: null,
      tickIntervalMs: 100,
      ...options,
    };

    async function getPosition(): Promise<number> {
      const message = await config.readLastMessage(subscriberStreamName);
      // Read `position` from the event data, not the `position` field (which is the position in the event's stream
      const position = message?.data?.position;
      if (typeof position === 'string') {
        return parseInt(position, 10);
      }
      if (typeof position === 'number') {
        return position
      }
      return 0;
    }

    async function savePosition(position: number): WriteResult {
      const positionEvent: EventInput = {
        id: generateUuid(),
        type: 'Read',
        data: { position }
      }
      return config.write(subscriberStreamName, positionEvent);
    }

    function start() {
      console.log(
        `>> Starting subscription to stream "${options.streamName}" for subscriber "${options.subscriberId}" <<`,
      );
      return Promise.resolve();
    }

    return {
      getPosition,
      savePosition,
      start,
      stop: () => null,
      tick: () => null,
    };
  };
}
