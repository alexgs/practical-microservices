/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { Knex } from 'knex';

import { DatabaseReader } from '../../lib';
import { MessageStore, WinterfellEvent } from '../message-store';

import { PAGES, Aggregator } from './index';

function createMessageHandlers(queries: ReturnType<typeof createQueries>) {
  // TODO Ideally, keys here would be limited in Typescript to defined message types
  return {
    VideoViewed: async (event: WinterfellEvent) => {
      return queries.incrementVideosViewed(event);
    },
  };
}

function createQueries(db: DatabaseReader) {
  return {
    createHomePage: async () => {
      const initialData = {
        pageData: { lastViewProcessed: 0, videosWatched: 0 }
      } as unknown as Knex.ValueDict;

      const query = `
        INSERT INTO
          pages(name, data)
        VALUES
          ('home', :pageData)
        ON CONFLICT DO NOTHING
      `;

      return db.raw(query, initialData);
    },
    incrementVideosViewed: async (event: WinterfellEvent) => {
      const query = `
        UPDATE
          pages
        SET
          data = jsonb_set(
            jsonb_set(
              data,
              '{videosViewed}',
              ((data ->> 'videosViewed')::int + 1)::text::jsonb
            ),
            '{lastViewProcessed}',
            ${event.global_position}::text::jsonb
          )
        WHERE
          name = '${PAGES.HOME}' AND
          (data ->> 'lastViewProcessed')::int < ${event.global_position}
      `;
      return db.raw(query);
    },
  };
}

export function createAggregator(
  db: DatabaseReader,
  messageStore: MessageStore,
): Aggregator {
  const queries = createQueries(db);
  const handlers = createMessageHandlers(queries);
  // const subscription = messageStore.createSubscription({
  //   streamName: 'viewing',
  //   handlers,
  //   subscriberId: 'aggregators:home-page',
  // });

  async function init() {
    return queries.createHomePage();
  }

  async function start() {
    await init();
    // await subscription.start();
  }

  return {
    handlers,
    init,
    queries,
    start,
  };
}
