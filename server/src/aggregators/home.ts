/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { DbClient, EventInput, WinterfellEvent } from '../../lib';

interface Startable {
  start: () => void;
}

interface Aggregator extends Startable {
  init: () => void;
}

function createMessageHandlers(queries: ReturnType<typeof createQueries>) {
  // TODO Ideally, keys here would be limited in Typescript to defined message types
  return {
    VideoViewed: async (event: EventInput) => {
      return;
    },
  };
}

function createQueries(db: DbClient) {
  return {
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
          name = 'home' AND
          (data ->>'lastViewProcessed')::int < ${event.global_position}
      `;
      return db.$executeRaw(query);
    },
  };
}

export function createAggregator(db: DbClient): Aggregator {
  return {
    init: () => {
      return;
    },
    start: () => {
      return;
    },
  };
}
