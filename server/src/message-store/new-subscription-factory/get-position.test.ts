/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { MockObject } from '../../types';

import { getPosition } from './get-position';
import { FactoryCrew, FinalSubscriptionOptions, State } from './public-types';

type MockCrew = MockObject<FactoryCrew>;

function getCrew(override?: Partial<MockCrew>): MockCrew {
  return {
    read: jest.fn().mockResolvedValue([]),
    readLastMessage: jest.fn(),
    write: jest.fn(),
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

describe('The `getPosition` function', () => {
  it('calls the `readLastMessage` crew function', async () => {
    const POSITION = 17;
    const crew = getCrew({
      readLastMessage: jest
        .fn()
        .mockReturnValue({ data: { position: POSITION } }),
    });
    const options = {} as FinalSubscriptionOptions;
    const state = getState();

    await getPosition(crew, options, state);
    expect(crew.readLastMessage).toHaveBeenCalledTimes(1);
  });

  it('handles "position" value as a string', async () => {
    const POSITION = 15;
    const crew = getCrew({
      readLastMessage: jest
        .fn()
        .mockReturnValue({ data: { position: POSITION.toString() } }),
    });
    const options = {} as FinalSubscriptionOptions;
    const state = getState();

    const result = await getPosition(crew, options, state);
    expect(result).toEqual(POSITION);
  });

  it('handles "position" value as a number', async () => {
    const POSITION = 87;
    const crew = getCrew({
      readLastMessage: jest
        .fn()
        .mockReturnValue({ data: { position: POSITION } }),
    });
    const options = {} as FinalSubscriptionOptions;
    const state = getState();

    const result = await getPosition(crew, options, state);
    expect(result).toEqual(POSITION);
  });

  it('handles "position" value is missing', async () => {
    const crew = getCrew({
      readLastMessage: jest
        .fn()
        .mockReturnValue({ data: { otherThing: 'Two' } }),
    });
    const options = {} as FinalSubscriptionOptions;
    const state = getState();

    const result = await getPosition(crew, options, state);
    expect(result).toEqual(0);
  });
});
