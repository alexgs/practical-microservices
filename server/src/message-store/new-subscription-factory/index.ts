/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { getPosition } from './get-position';
import {
  CreateSubscriptionOptions,
  FactoryCrew,
  FinalOptions,
  State,
  Subscription,
  WriteResult,
} from './types';

export function createSubscriptionFactory(crew: FactoryCrew) {
  return function createSubscription(
    options: CreateSubscriptionOptions,
  ): Subscription {
    const state: State = {
      currentPosition: 0,
      messagesSinceLastPositionUpdate: 0,
      continuePolling: true,
      subscriberStreamName: `subscriberPosition-${options.subscriberId}`,
    };

    const finalOptions: FinalOptions = {
      messagesPerTick: 100,
      positionUpdateCount: 100,
      // originStreamName: null,
      tickIntervalMs: 100,
      ...options,
    };

    async function loadPosition(): Promise<void> {
      state.currentPosition = await getPosition(crew, finalOptions, state);
    }

    async function poll(): Promise<void> {
      return Promise.resolve();
    }

    async function savePosition(position: number): Promise<WriteResult> {
      // @ts-ignore // TODO
      return Promise.resolve({});
    }

    async function start(): Promise<void> {
      return Promise.resolve(undefined);
    }

    async function stop(): Promise<void> {
      return Promise.resolve(undefined);
    }

    // TODO Add tests for this function
    async function updateReadPosition(position: number): Promise<WriteResult | true> {
      state.currentPosition = position;
      state.messagesSinceLastPositionUpdate += 1;
      if (state.messagesSinceLastPositionUpdate >= finalOptions.positionUpdateCount) {
        state.messagesSinceLastPositionUpdate = 0;
        return savePosition(position);
      }

      return true;
    }

    return {
      loadPosition,
      savePosition,
      start,
      stop,
      poll,
    };
  };
}
