/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { Knex } from 'knex';

import { ViewDatabase } from '../../lib';
import { Config } from '../config';
import { WinterfellEvent } from '../message-store';

import { PAGES, Aggregator } from './index';

function createMessageHandlers(queries: ReturnType<typeof createQueries>) {
  // TODO Ideally, keys here would be limited in Typescript to defined message types
  return {
    VideoViewed: async (event: WinterfellEvent) => {
      return queries.incrementVideosViewed(event);
    },
  };
}

function createQueries(db: ViewDatabase) {
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
              '{videosWatched}',
              ((data ->> 'videosWatched')::int + 1)::text::jsonb
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

export function createAggregator(config: Config): Aggregator {
  const queries = createQueries(config.viewDb);
  const handlers = createMessageHandlers(queries);
  const subscription = config.messageStore.createSubscription({
    streamName: 'viewing',
    handlers,
    subscriberId: 'aggregators:home-page',
  });

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
