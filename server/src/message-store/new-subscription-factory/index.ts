/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { getPosition as getPositionImpl } from './get-position';
import {
  CreateSubscriptionOptions,
  FactoryCrew,
  FinalOptions,
  Subscription,
  WriteResult,
} from './types';

export function createSubscriptionFactory(crew: FactoryCrew) {
  return function createSubscription(
    options: CreateSubscriptionOptions,
  ): Subscription {
    const subscriberStreamName = `subscriberPosition-${options.subscriberId}`;
    let continuePolling = true;

    const finalOptions: FinalOptions = {
      messagesPerTick: 100,
      positionUpdateIntervalMs: 100,
      // originStreamName: null,
      tickIntervalMs: 100,
      ...options,
    };

    async function getPosition(): Promise<number> {
      return getPositionImpl(crew, subscriberStreamName);
    }

    async function poll(): Promise<void> {
      return Promise.resolve();
    }

    async function savePosition(position: number): WriteResult {
      // @ts-ignore // TODO
      return Promise.resolve({});
    }

    async function start(): Promise<void> {
      return Promise.resolve(undefined);
    }

    async function stop(): Promise<void> {
      return Promise.resolve(undefined);
    }

    return {
      getPosition,
      savePosition,
      start,
      stop,
      poll,
    };
  };
}
