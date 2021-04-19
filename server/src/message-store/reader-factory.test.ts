/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { pg as theRealAdapter } from '../../lib';

import { ALL_EVENTS_STREAM } from './index';
import {
  SQL,
  readAllEvents,
  readCategoryStream,
  readEntityStream,
  readerFactory,
} from './reader-factory';

describe('`ReaderFactory` module', () => {
  describe('The `Reader` object', () => {
    describe('function `read`', () => {
      it('correctly routes reading all events', async () => {
        const mockDb = { query: jest.fn().mockResolvedValue({ rows: [] }) };
        const fromPosition = 1001;
        const maxMessages = 27;

        const reader = readerFactory(mockDb);
        await reader.read(ALL_EVENTS_STREAM, fromPosition, maxMessages);
        expect(mockDb.query).toHaveBeenCalledTimes(1);

        const args = mockDb.query.mock.calls[0];
        expect(args[0]).toEqual(SQL.READ_ALL_EVENTS);
        expect(args[1]).toEqual([fromPosition, maxMessages]);
      });

      it('correctly routes reading an entity stream', async () => {
        const mockDb = { query: jest.fn().mockResolvedValue({ rows: [] }) };
        const fromPosition = 6453;
        const maxMessages = 62;
        const streamName = 'videoViewed-1';

        const reader = readerFactory(mockDb);
        await reader.read(streamName, fromPosition, maxMessages);
        expect(mockDb.query).toHaveBeenCalledTimes(1);

        const args = mockDb.query.mock.calls[0];
        expect(args[0]).toEqual(SQL.READ_ENTITY_STREAM);
        expect(args[1]).toEqual([streamName, fromPosition, maxMessages]);
      });

      it('correctly routes reading a category stream', async () => {
        const mockDb = { query: jest.fn().mockResolvedValue({ rows: [] }) };
        const fromPosition = 296;
        const maxMessages = 38;
        const streamName = 'videoViewed';

        const reader = readerFactory(mockDb);
        await reader.read(streamName, fromPosition, maxMessages);
        expect(mockDb.query).toHaveBeenCalledTimes(1);

        const args = mockDb.query.mock.calls[0];
        expect(args[0]).toEqual(SQL.READ_CATEGORY_STREAM);
        expect(args[1]).toEqual([streamName, fromPosition, maxMessages]);
      });
    });

    describe('function `readLastMessage`', () => {
      it('queries the database', async () => {
        const mockDb = { query: jest.fn().mockResolvedValue({ rows: [] }) };
        const streamName = 'test-stream:name';

        const reader = readerFactory(mockDb);
        await reader.readLastMessage(streamName);
        expect(mockDb.query).toHaveBeenCalledTimes(1);

        const args = mockDb.query.mock.calls[0];
        expect(args[0]).toEqual(SQL.READ_LAST_MESSAGE);
        expect(args[1]).toEqual([streamName]);
      });

      // eslint-disable-next-line jest/no-disabled-tests
      it.skip('really does the thing', async () => {
        const reader = readerFactory(theRealAdapter);
        const result = await reader.readLastMessage('viewing-1');
        console.log(result);
        expect(result).toBeTruthy();
      });
    });
  });

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
