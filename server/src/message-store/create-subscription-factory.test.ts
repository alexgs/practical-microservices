import {
  CreateSubscriptionOptions,
  createSubscriptionFactory,
} from './create-subscription-factory';

interface MockFactoryConfig {
  read: jest.Mock;
  readLastMessage: jest.Mock;
  write: jest.Mock;
}

function getConfig(override?: Partial<MockFactoryConfig>): MockFactoryConfig {
  return {
    read: jest.fn(),
    readLastMessage: jest.fn(),
    write: jest.fn(),
    ...override,
  };
}

function getOptions(
  override?: CreateSubscriptionOptions,
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
    it('calls the `readLastMessage` function', async () => {
      const POSITION = 17;
      const config = getConfig({
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
  });

  describe('The `savePosition` function', () => {
    it('calls the message writer', async () => {
      const config = getConfig();
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
