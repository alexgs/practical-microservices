import { createSubscriptionFactory } from './create-subscription-factory';

describe('The `Subscription` object', () => {
  describe('The `savePosition` function', () => {
    it('calls the message writer', async () => {
      const mocks = {
        read: jest.fn(),
        readLastMessage: jest.fn(),
        write: jest.fn(),
      };
      const createSubscription = createSubscriptionFactory(mocks);
      const options = {
        handlers: {},
        streamName: 'testing',
        subscriberId: 'tests:create-subscription-factory',
      };
      const subscription = createSubscription(options);

      const position = 10;
      await subscription._savePosition(position);
      expect(mocks.write).toHaveBeenCalledTimes(1);

      const args = mocks.write.mock.calls[0];
      expect(args[0]).toEqual(`subscriberPosition-${options.subscriberId}`);
      expect(args[1]).toMatchObject({
        id: expect.any(String),
        type: 'Read',
        data: { position },
      });
    });
  });
});
