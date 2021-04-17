/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import Hapi from '@hapi/hapi';
import * as env from 'env-var';
import { v4 as getUuid } from 'uuid';

import { db, pg } from '../lib';

import {
  PAGES,
  createHomeAggregator,
} from './aggregators';
import { createMessageStore } from './message-store';
import { Startable } from './types';

const PORT = env.get('SERVER_PORT').required().asPortNumber();

interface WinterfellAppState extends Hapi.RequestApplicationState {
  traceId?: string;
}

interface WinterfellRequest extends Hapi.Request {
  app: WinterfellAppState;
}

const messageStore = createMessageStore(pg);

// TODO Would it be better to use [server.bind][1]?
//   [1]: https://hapi.dev/api/?v=20.1.2#server.bind()
const plugin: Hapi.Plugin<null> = {
  name: 'first-plugin',
  // eslint-disable-next-line @typescript-eslint/require-await
  register: async (server) => {
    server.ext('onRequest', function (request: WinterfellRequest, h) {
      request.app.traceId = getUuid();
      return h.continue;
    });
  },
};

const main = async () => {
  const server = Hapi.server({
    port: PORT,
  });

  await server.register(plugin);

  const homeAggregator = createHomeAggregator(db, messageStore);
  const aggregators: Startable[] = [homeAggregator];
  for (const ag of aggregators) {
    await ag.start();
  }

  server.route({
    method: 'GET',
    path: '/',
    handler: () => {
      return 'Hello Winterfell!';
    },
  });

  server.route({
    method: 'GET',
    path: '/api/pages/home',
    handler: async (request: WinterfellRequest, h) => {
      const data = await db.pages.findFirst({
        where: { name: PAGES.HOME },
      });
      return h
        .response({ data })
        .header('X-Trace-ID', request.app.traceId ?? 'missing-trace-id-0002');
    },
  });

  // First application. Eventually, it will probably be a good idea to de-couple
  //   creating the routes and the handlers and connecting them to the Hapi
  //   server, but I'm not doing that in the beginning.
  server.route({
    method: 'GET',
    path: '/api/videos',
    handler: async (request: WinterfellRequest, h) => {
      const data = await db.video.findMany({
        orderBy: { id: 'asc' },
        take: 5,
      });
      return h
        .response({ data })
        .header('X-Trace-ID', request.app.traceId ?? 'missing-trace-id-0000');
    },
  });

  server.route({
    method: 'POST',
    path: '/api/videos/{videoId}/record-view',
    handler: async (request: WinterfellRequest) => {
      const traceId = request.app.traceId ?? 'missing-trace-id-0001';
      const userId = 2; // TODO Change this after we actually have user registration
      const videoId = request.params.videoId as string;

      const event = {
        id: getUuid(),
        type: 'VideoViewed', // TODO Standardize these with a global constant
        metadata: {
          traceId,
          userId,
        },
        data: {
          userId,
          videoId,
        },
      };
      const streamName = `viewing-${videoId}`;
      // Closing over the messageStore like this is a form of dependency
      // injection, albeit a very simple, cheap, and brittle one
      await messageStore
        .write(streamName, event)
        .catch((error) => console.log(error));

      return { videoId }; // TODO What's an appropriate response payload?
    },
  });

  await server.start();
  return server;
};

process.on('unhandledRejection', (error) => {
  console.log(error);
  process.exit(2);
});

main()
  .then((server) => {
    process.once('SIGTERM', () => {
      void server.stop({ timeout: 100 });
    });

    console.log(`Server listening on ${server.info.uri}`);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
