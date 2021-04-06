import Hapi from '@hapi/hapi';
import * as env from 'env-var';
import { v4 as getUuid } from 'uuid';

const PORT = env.get('SERVER_PORT').required().asPortNumber();

interface WinterfellAppState extends Hapi.RequestApplicationState {
  traceId?: string;
}

interface WinterfellRequest extends Hapi.Request {
  app: WinterfellAppState;
}

const plugin: Hapi.Plugin<null> = {
  name: 'first-plugin',
  // eslint-disable-next-line @typescript-eslint/require-await
  register: async (server) => {
    server.ext('onRequest', function (request: WinterfellRequest, h) {
      const traceId = getUuid();
      console.log(`>> Starting request with trace ID ${traceId} <<`);
      request.app.traceId = traceId;
      return h.continue;
    });
  },
};

const main = async () => {
  const server = Hapi.server({
    port: PORT,
  });

  await server.register(plugin);

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'Hello Winterfell!';
    },
  });

  // First application. Eventually, it will probably be a good idea to de-couple
  //   creating the routes and the handlers and connecting them to the Hapi
  //   server, but I'm not doing that in the beginning.
  server.route({
    method: 'GET',
    path: '/api/videos',
    handler: (request: WinterfellRequest, h) => {
      return {
        message: 'Hello videos',
        traceId: request.app.traceId,
      };
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
