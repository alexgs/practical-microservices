/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { DatabaseWriter, createDatabaseReader } from '../lib';

import { createHomeAggregator } from './aggregators';
import { getConfig } from './config';
import { createExpressApp } from './express';
import { MessageStore } from './message-store';
import { Startable } from './types';

async function main() {
  const config = getConfig();
  const dbReader = await createDatabaseReader(config.env.MESSAGE_STORE_URL);
  const dbWriter = new DatabaseWriter(config.env.MESSAGE_STORE_URL);
  const messageStore = new MessageStore(dbWriter);

  const homeAggregator = createHomeAggregator(dbReader, messageStore);
  const aggregators: Startable[] = [homeAggregator];
  for (const ag of aggregators) {
    await ag.start();
  }

  const app = createExpressApp(config);

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(config.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${config.env.PORT}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
