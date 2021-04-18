import { v4 as generateUuid } from 'uuid';

import { sleep } from '../../lib';
import { MockObject } from '../types';

import {
  CreateSubscriptionOptions,
  FactoryCrew,
  createSubscriptionFactory,
} from './create-subscription-factory';
import { WinterfellEvent } from './index';

type MockCrew = MockObject<FactoryCrew>;

interface EventGenOptions {
  count: number;
  eventType: string;
  startPosition: number;
  streamName: string;
}

function generateMockEvents(options: EventGenOptions): WinterfellEvent[] {
  const output: WinterfellEvent[] = [];
  let i = 0;
  while (i < options.count) {
    const position = options.startPosition + i;
    const globalPos = position + 1000;
    const event: WinterfellEvent = {
      id: generateUuid(),
      type: options.eventType,
      global_position: globalPos,
      position,
      stream_name: options.streamName,
      data: { codeName: 'Winter Soldier' },
    };
    output.push(event);
    i++;
  }
  return output;
}

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
): CreateSubscriptionOptions {
  return {
    handlers: {},
    streamName: 'testing',
    subscriberId: 'tests:create-subscription-factory',
    ...override,
  };
}

describe('The `Subscription` object', () => {
  describe('The `getPosition` function', () => {
    it('calls the `readLastMessage` crew function', async () => {
      const POSITION = 17;
      const config = getCrew({
        readLastMessage: jest
          .fn()
          .mockReturnValue({ data: { position: POSITION } }),
      });
      const options = getOptions();
      const createSubscription = createSubscriptionFactory(config);
      const subscription = createSubscription(options);

      await subscription._getPosition();
      expect(config.readLastMessage).toHaveBeenCalledTimes(1);
    });

    it('handles "position" value as a string', async () => {
      const POSITION = 15;
      const config = getCrew({
        readLastMessage: jest
          .fn()
          .mockReturnValue({ data: { position: POSITION.toString() } }),
      });
      const options = getOptions();
      const createSubscription = createSubscriptionFactory(config);
      const subscription = createSubscription(options);

      const result = await subscription._getPosition();
      expect(result).toEqual(POSITION);
    });

    it('handles "position" value as a number', async () => {
      const POSITION = 87;
      const config = getCrew({
        readLastMessage: jest
          .fn()
          .mockReturnValue({ data: { position: POSITION } }),
      });
      const options = getOptions();
      const createSubscription = createSubscriptionFactory(config);
      const subscription = createSubscription(options);

      const result = await subscription._getPosition();
      expect(result).toEqual(POSITION);
    });

    it('handles "position" value is missing', async () => {
      const config = getCrew({
        readLastMessage: jest
          .fn()
          .mockReturnValue({ data: { otherThing: 'Two' } }),
      });
      const options = getOptions();
      const createSubscription = createSubscriptionFactory(config);
      const subscription = createSubscription(options);

      const result = await subscription._getPosition();
      expect(result).toEqual(0);
    });
  });

  describe('The `savePosition` function', () => {
    it('calls the `writer` crew function', async () => {
      const config = getCrew();
      const options = getOptions();
      const createSubscription = createSubscriptionFactory(config);
      const subscription = createSubscription(options);

      const position = 10;
      await subscription._savePosition(position);
      expect(config.write).toHaveBeenCalledTimes(1);

      const args = config.write.mock.calls[0];
      expect(args[0]).toEqual(`subscriberPosition-${options.subscriberId}`);
      expect(args[1]).toMatchObject({
        id: expect.any(String),
        type: 'Read',
        data: { position },
      });
    });
  });

  describe('The `start` function', () => {
    it('calls the `readLastMessage` crew function', async () => {
      const POSITION = 17;
      const config = getCrew({
        readLastMessage: jest
          .fn()
          .mockReturnValue({ data: { position: POSITION } }),
      });
      const options = getOptions();
      const createSubscription = createSubscriptionFactory(config);
      const subscription = createSubscription(options);

      // Start polling in the background, wait, and stop
      void subscription.start();
      await sleep(50);
      subscription.stop();

      expect(config.readLastMessage).toHaveBeenCalledTimes(1);
    });

    it('calls the `read` crew function', async () => {
      const POSITION = 23;
      const crew = getCrew({
        readLastMessage: jest
          .fn()
          .mockReturnValue({ data: { position: POSITION } }),
      });
      const options = getOptions();
      const createSubscription = createSubscriptionFactory(crew);
      const subscription = createSubscription(options);

      // Start polling in the background, wait, and stop
      void subscription.start();
      await sleep(50);
      subscription.stop();

      expect(crew.read).toHaveBeenCalledTimes(1);

      const args = crew.read.mock.calls[0];
      expect(args[0]).toEqual(options.streamName);
      expect(args[1]).toEqual(POSITION + 1);
    });

    it('calls the `VideoViewed` handler for "VideoViewed" events', async () => {
      const POSITION = 23;
      const options = getOptions({
        handlers: { VideoViewed: jest.fn() },
      });
      const eventOptions = {
        streamName: options.streamName,
        count: 3,
        startPosition: POSITION + 1,
        eventType: 'VideoViewed',
      };
      const events = generateMockEvents(eventOptions);
      const crew = getCrew({
        read: jest.fn().mockResolvedValue(events),
        readLastMessage: jest
          .fn()
          .mockReturnValue({ data: { position: POSITION } }),
      });
      const createSubscription = createSubscriptionFactory(crew);
      const subscription = createSubscription(options);

      // Start polling in the background, wait, and stop
      void subscription.start();
      await sleep(50);
      subscription.stop();

      expect(options.handlers.VideoViewed).toHaveBeenCalledTimes(
        eventOptions.count,
      );
    });

    it('calls the `write` crew function to save the updated position', async () => {
      const POSITION = 23;
      const options = getOptions({
        handlers: { VideoViewed: jest.fn() },
      });
      const eventOptions = {
        streamName: options.streamName,
        count: 3,
        startPosition: POSITION + 1,
        eventType: 'VideoViewed',
      };
      const events = generateMockEvents(eventOptions);
      const crew = getCrew({
        read: jest.fn().mockResolvedValue(events),
        readLastMessage: jest
          .fn()
          .mockReturnValue({ data: { position: POSITION } }),
      });
      const createSubscription = createSubscriptionFactory(crew);
      const subscription = createSubscription(options);

      // Start polling in the background, wait, and stop
      void subscription.start();
      await sleep(50);
      subscription.stop();

      expect(crew.write).toHaveBeenCalledTimes(1);

      const args = crew.write.mock.calls[0];
      expect(args[0]).toEqual(`subscriberPosition-${options.subscriberId}`);
      expect(args[1]).toMatchObject({
        id: expect.any(String),
        type: 'Read',
        data: { position: POSITION + events.length },
      });
    });
  });
});
