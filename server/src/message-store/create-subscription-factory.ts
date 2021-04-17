/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Startable } from '../types';

import { WriteFn } from './write-factory';

export interface CreateSubscriptionOptions {
  // eslint-disable-next-line @typescript-eslint/ban-types
  handlers: Record<string, Function>;
  streamName: string;
  subscriberId: string;
}

export interface FactoryConfig {
  read: any;
  readLastMessage: any;
  write: WriteFn;
}

export interface Subscription extends Startable {
  getPosition: () => void;
  savePosition: () => void;
  stop: () => void;
  tick: () => void;
}

export function createSubscriptionFactory(config: FactoryConfig) {
  return function createSubscription(options: CreateSubscriptionOptions): Subscription {
    const subscriberStreamName = `subscriberPosition-${options.subscriberId}`;
    let currentPosition = 0
    let messagesSinceLastPositionSave = 0
    let keepGoing = true

    function start() {
      console.log(
        `>> Starting subscription to stream "${options.streamName}" for subscriber "${options.subscriberId}" <<`,
      );
      return Promise.resolve();
    }

    return {
      start,
      getPosition: () => null,
      savePosition: () => null,
      stop: () => null,
      tick: () => null,
    };
  };
}
