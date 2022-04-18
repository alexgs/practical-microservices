/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { FactoryCrew, FinalSubscriptionOptions, State } from './types';

export async function getPosition(
  crew: FactoryCrew,
  options: FinalSubscriptionOptions,
  state: State,
): Promise<number> {
  const message = await crew.readLastMessage(state.subscriberStreamName);
  // Read `position` from the event data, not the `position` field (which is the position in the event's stream)
  const position = message?.data?.position;
  if (typeof position === 'string') {
    return parseInt(position, 10);
  }
  if (typeof position === 'number') {
    return position;
  }
  return 0;
}
