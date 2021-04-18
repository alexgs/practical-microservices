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

export interface FactoryCrew {
  read: (
    streamName: string,
    fromPosition?: number,
    maxMessages?: number,
  ) => Promise<WinterfellEvent[]>;
  readLastMessage: (streamName: string) => Promise<WinterfellEvent>;
  write: WriteFn;
}

export interface Subscription extends Startable {
  // "Hidden" methods exported for testing
  _getPosition: () => Promise<number>;
  _poll: () => Promise<void>;
  _savePosition: (position: number) => WriteResult;

  getPosition: () => Promise<number>;
  savePosition: (position: number) => WriteResult;
  stop: () => void;
  tick: () => void;
}

async function sleep(milliseconds: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  })
}

export function createSubscriptionFactory(crew: FactoryCrew) {
  return function createSubscription(
    options: CreateSubscriptionOptions,
  ): Subscription {
    const subscriberStreamName = `subscriberPosition-${options.subscriberId}`;
    let continuePolling = true;

    const finalOptions: Readonly<Required<CreateSubscriptionOptions>> = {
      messagesPerTick: 100,
      positionUpdateIntervalMs: 100,
      originStreamName: null,
      tickIntervalMs: 100,
      ...options,
    };

    async function getPosition(): Promise<number> {
      const message = await crew.readLastMessage(subscriberStreamName);
      // Read `position` from the event data, not the `position` field (which is the position in the event's stream)
      const position = message?.data?.position;
      if (typeof position === 'string') {
        return parseInt(position, 10);
      }
      if (typeof position === 'number') {
        return position
      }
      return 0;
    }

    async function poll() {
      const currentPosition = await getPosition();

      while (continuePolling) {
        // Fetch new messages
        // - Get current position
        // - Query message store
        // Process the messages
        // - Call handler
        // - Update position
        // Save new position
        // Sleep
      }
    }

    async function savePosition(position: number): WriteResult {
      const positionEvent: EventInput = {
        id: generateUuid(),
        type: 'Read',
        data: { position }
      }
      return crew.write(subscriberStreamName, positionEvent);
    }

    function start(): Promise<void> {
      console.log(
        `>> Starting subscription to stream "${finalOptions.streamName}" for subscriber "${finalOptions.subscriberId}" <<`,
      );
      return poll();
    }

    function stop() {
      console.log(
        `>> Stopping subscription for subscriber "${finalOptions.subscriberId}" <<`,
      );
      continuePolling = false;
    }

    return {
      // "Hidden" methods exported for testing
      _getPosition: getPosition,
      _poll: poll,
      _savePosition: savePosition,

      getPosition,
      savePosition,
      start,
      stop,
      tick: () => null,
    };
  };
}
