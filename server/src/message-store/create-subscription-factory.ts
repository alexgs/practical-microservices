/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Startable } from '../types';

import { WinterfellEvent } from './index';
import { WriteFn } from './write-factory';

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
  getPosition: () => void;
  savePosition: () => void;
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

    async function getPosition() {
      const message = await config.readLastMessage(subscriberStreamName);
      return message?.position ?? 0;
    }

    function start() {
      console.log(
        `>> Starting subscription to stream "${options.streamName}" for subscriber "${options.subscriberId}" <<`,
      );
      return Promise.resolve();
    }

    return {
      getPosition,
      start,
      savePosition: () => null,
      stop: () => null,
      tick: () => null,
    };
  };
}
