/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { MockObject } from '../../types';

import { getPosition } from './get-position';
import { FactoryCrew } from './types';

type MockCrew = MockObject<FactoryCrew>;

function getCrew(override?: Partial<MockCrew>): MockCrew {
  return {
    read: jest.fn().mockResolvedValue([]),
    readLastMessage: jest.fn(),
    write: jest.fn(),
    ...override,
  };
}

describe('The `getPosition` function', () => {
  it('calls the `readLastMessage` crew function', async () => {
    const POSITION = 17;
    const config = getCrew({
      readLastMessage: jest
        .fn()
        .mockReturnValue({ data: { position: POSITION } }),
    });
    const streamName = 'subscriberPosition-123';

    await getPosition(config, streamName);
    expect(config.readLastMessage).toHaveBeenCalledTimes(1);
  });

  it('handles "position" value as a string', async () => {
    const POSITION = 15;
    const config = getCrew({
      readLastMessage: jest
        .fn()
        .mockReturnValue({ data: { position: POSITION.toString() } }),
    });
    const streamName = 'subscriberPosition-123';

    const result = await getPosition(config, streamName);
    expect(result).toEqual(POSITION);
  });

  it('handles "position" value as a number', async () => {
    const POSITION = 87;
    const config = getCrew({
      readLastMessage: jest
        .fn()
        .mockReturnValue({ data: { position: POSITION } }),
    });
    const streamName = 'subscriberPosition-123';

    const result = await getPosition(config, streamName);
    expect(result).toEqual(POSITION);
  });

  it('handles "position" value is missing', async () => {
    const config = getCrew({
      readLastMessage: jest
        .fn()
        .mockReturnValue({ data: { otherThing: 'Two' } }),
    });
    const streamName = 'subscriberPosition-123';

    const result = await getPosition(config, streamName);
    expect(result).toEqual(0);
  });
});
