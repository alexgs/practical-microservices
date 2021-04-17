/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Startable } from '../types';

export interface CreateSubscriptionOptions {
  // eslint-disable-next-line @typescript-eslint/ban-types
  handlers: Record<string, Function>;
  streamName: string;
  subscriberId: string;
}

export interface Subscription extends Startable {}

export function createSubscriptionFactory() {
  return function createSubscription(options: CreateSubscriptionOptions): Subscription {
    return {
      start: () => {
        console.log(
          `>> Starting subscription to stream "${options.streamName}" for subscriber "${options.subscriberId}" <<`,
        );
        return Promise.resolve();
      },
    };
  };
}
