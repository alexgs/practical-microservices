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
