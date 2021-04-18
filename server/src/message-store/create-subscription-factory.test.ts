import {
  CreateSubscriptionOptions,
  FactoryCrew,
  createSubscriptionFactory,
} from './create-subscription-factory';

type Mocked<Type> = {
  [Property in keyof Type]: jest.Mock
};

type MockCrew = Mocked<FactoryCrew>

function getCrew(override?: Partial<MockCrew>): MockCrew {
  return {
    read: jest.fn(),
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

  describe.skip('The `poll` function', () => {});
});
