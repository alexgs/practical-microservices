/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { pg as theRealAdapter } from '../../lib';

import {
  SQL,
  readAllEvents,
  readCategoryStream,
  readEntityStream,
} from './reader-factory';

describe('`ReaderFactory` module', () => {
  describe('Helper functions', () => {
    describe('`readAllEvents`', () => {
      it('queries the database', async () => {
        const mockDb = { query: jest.fn().mockResolvedValue({ rows: [] }) };
        const fromPosition = 11;
        const maxMessages = 15;

        await readAllEvents(mockDb, fromPosition, maxMessages);
        expect(mockDb.query).toHaveBeenCalledTimes(1);

        const args = mockDb.query.mock.calls[0];
        expect(args[0]).toEqual(SQL.READ_ALL_EVENTS);
        expect(args[1]).toEqual([fromPosition, maxMessages]);
      });

      // eslint-disable-next-line jest/no-disabled-tests
      it.skip('really does the thing', async () => {
        const result = await readAllEvents(theRealAdapter);
        console.log(result);
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('`readCategoryStream`', () => {
      it('queries the database', async () => {
        const mockDb = { query: jest.fn().mockResolvedValue({ rows: [] }) };
        const fromPosition = 11;
        const maxMessages = 15;
        const streamName = 'videoViewed';

        await readCategoryStream(mockDb, streamName, fromPosition, maxMessages);
        expect(mockDb.query).toHaveBeenCalledTimes(1);

        const args = mockDb.query.mock.calls[0];
        expect(args[0]).toEqual(SQL.READ_CATEGORY_STREAM);
        expect(args[1]).toEqual([streamName, fromPosition, maxMessages]);
      });
    });

    describe('`readEntityStream`', () => {
      it('queries the database', async () => {
        const mockDb = { query: jest.fn().mockResolvedValue({ rows: [] }) };
        const fromPosition = 11;
        const maxMessages = 15;
        const streamName = 'videoViewed-1';

        await readEntityStream(mockDb, streamName, fromPosition, maxMessages);
        expect(mockDb.query).toHaveBeenCalledTimes(1);

        const args = mockDb.query.mock.calls[0];
        expect(args[0]).toEqual(SQL.READ_ENTITY_STREAM);
        expect(args[1]).toEqual([streamName, fromPosition, maxMessages]);
      });
    });
  });
});
