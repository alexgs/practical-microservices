/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { DbClient, MessageStore, WinterfellEvent } from '../../lib';

export const PAGE = {
  HOME: 'home',
};

export interface Startable {
  start: () => Promise<void>;
}

interface Aggregator extends Startable {
  /* eslint-disable @typescript-eslint/ban-types */
  handlers: Record<string, Function>;
  init: () => void;
  queries: Record<string, Function>;
  /* eslint-enable @typescript-eslint/ban-types */
}

function createMessageHandlers(queries: ReturnType<typeof createQueries>) {
  // TODO Ideally, keys here would be limited in Typescript to defined message types
  return {
    VideoViewed: async (event: WinterfellEvent) => {
      return queries.incrementVideosViewed(event);
    },
  };
}

function createQueries(db: DbClient) {
  return {
    createHomePage: async () => {
      try {
        await db.pages.create({
          data: {
            name: PAGE.HOME,
            data: {
              lastViewProcessed: 0,
              videosViewed: 0,
            },
          },
        });
      } catch (error) {
        /* eslint-disable @typescript-eslint/no-unsafe-member-access */
        // Ignore Prisma errors with these codes; they indicate that the record already exists
        const constraintErrorCodes = ['P2002', 'P2004'];
        if (
          typeof error.code === 'string' &&
          !constraintErrorCodes.includes(error.code)
        ) {
          throw error;
        }
        /* eslint-enable @typescript-eslint/no-unsafe-member-access */
      }
    },
    incrementVideosViewed: async (event: WinterfellEvent) => {
      // Prisma does not currently (v2.20) support all of the JSON functions to
      // do this without executing the raw query
      const query = `
        UPDATE
          Pages
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
          name = '${PAGE.HOME}' AND
          (data ->>'lastViewProcessed')::int < ${event.global_position}
      `;
      return db.$executeRaw(query);
    },
  };
}

export function createAggregator(
  db: DbClient,
  messageStore: MessageStore,
): Aggregator {
  const queries = createQueries(db);
  const handlers = createMessageHandlers(queries);
  const subscription = messageStore.createSubscription({
    streamName: 'viewing',
    handlers,
    subscriberId: 'aggregators:home-page',
  });

  async function init() {
    return queries.createHomePage();
  }

  async function start() {
    await init();
    subscription.start();
  }

  return {
    handlers,
    init,
    queries,
    start,
  };
}
