/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { v4 as generateUuid } from 'uuid';

import { logger, sleep } from '../../lib';
import { Startable } from '../types';

import { EventInput, WinterfellEvent } from './index';
import { Reader } from './reader-factory';
import { WriteFn, WriteResult } from './writer-factory';

export type CreateSubscriptionFn = ReturnType<typeof createSubscriptionFactory>;

export interface CreateSubscriptionOptions {
  handlers: Record<string, MessageHandler>;
  messagesPerTick?: number;
  originStreamName?: string | null;
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

export type MessageHandler = (event: WinterfellEvent) => Promise<unknown>;

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
      while (continuePolling) {
        // Fetch new messages
        const currentPosition = await getPosition();
        const newMessages = await crew.read(finalOptions.streamName, currentPosition + 1);

        // Process the messages
        for (const message of newMessages) {
          await finalOptions.handlers[message.type](message);
        }

        // Save new position and wait
        await savePosition(currentPosition + newMessages.length);
        await sleep(finalOptions.tickIntervalMs);
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
      logger.debug(
        `>> Starting subscription to stream "${finalOptions.streamName}" for subscriber "${finalOptions.subscriberId}" <<`,
      );
      return poll();
    }

    function stop() {
      logger.debug(
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
