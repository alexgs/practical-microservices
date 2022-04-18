/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { v4 as generateUuid } from 'uuid';

import { EventInput } from '../types';

import { FactoryCrew, FinalSubscriptionOptions, State, WriteResult } from './public-types';

export async function writePosition(
  crew: FactoryCrew,
  options: FinalSubscriptionOptions,
  state: State,
  position: number,
): Promise<WriteResult> {
  const positionEvent: EventInput = {
    id: generateUuid(),
    type: 'Read',
    data: { position },
  };
  return crew.write(state.subscriberStreamName, positionEvent);
}
