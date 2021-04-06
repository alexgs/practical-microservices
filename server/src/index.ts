import Hapi from '@hapi/hapi';
import * as env from 'env-var';

const PORT = env.get('SERVER_PORT').required().asPortNumber();

const main = async () => {
  const server = Hapi.server({
    port: PORT,
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'Hello Winterfell!';
    }
  });

  // First application. Eventually, it will probably be a good idea to de-couple
  //   creating the routes and the handlers and connecting them to the Hapi
  //   server, but I'm not doing that in the beginning.
  server.route({
    method: 'GET',
    path: '/api/videos',
    handler: (request, h) => {
      return {
        message: 'Hello videos',
        traceId: request.traceId,
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
