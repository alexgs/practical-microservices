/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import {
  CreateSubscriptionOptions,
  FactoryCrew,
  Subscription, WriteResult,
} from './types';

export function createSubscriptionFactory(crew: FactoryCrew) {
  return function createSubscription(
    options: CreateSubscriptionOptions,
  ): Subscription {

    async function getPosition(): Promise<number> {
      return Promise.resolve(0);
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
