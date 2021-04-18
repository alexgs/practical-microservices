import {
  CreateSubscriptionOptions,
  createSubscriptionFactory,
} from './create-subscription-factory';

interface MockFactoryConfig {
  read: jest.Mock;
  readLastMessage: jest.Mock;
  write: jest.Mock;
}

function getConfig(override?: MockFactoryConfig): MockFactoryConfig {
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
});
