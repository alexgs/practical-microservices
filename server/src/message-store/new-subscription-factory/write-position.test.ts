/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { MockObject } from '../../types';

import {
  CreateSubscriptionOptions,
  FactoryCrew,
  FinalOptions,
  State,
} from './types';
import { writePosition } from './write-position';

type MockCrew = MockObject<FactoryCrew>;

function getCrew(override?: Partial<MockCrew>): MockCrew {
  return {
    read: jest.fn().mockResolvedValue([]),
    readLastMessage: jest.fn(),
    write: jest.fn(),
    ...override,
  };
}

function getOptions(
  override?: Partial<CreateSubscriptionOptions>,
): FinalOptions {
  return {
    handlers: {},
    messagesPerTick: 100,
    positionUpdateCount: 100,
    tickIntervalMs: 250,
    streamName: 'testing',
    subscriberId: 'tests:create-subscription-factory',
    ...override,
  };
}

function getState(override?: Partial<State>): State {
  return {
    currentPosition: 0,
    messagesSinceLastPositionUpdate: 0,
    continuePolling: true,
    subscriberStreamName: `subscriberPosition-123`,
    ...override,
  };
}

describe('The `savePosition` function', () => {
  it('calls the `writer` crew function', async () => {
    const config = getCrew();
    const options = getOptions();
    const state = getState();
    const position = 10;

    await writePosition(config, options, state, position);
    expect(config.write).toHaveBeenCalledTimes(1);

    const args = config.write.mock.calls[0];
    expect(args[0]).toEqual(state.subscriberStreamName);
    expect(args[1]).toMatchObject({
      id: expect.any(String),
      type: 'Read',
      data: { position },
    });
  });
});
