/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as env from 'env-var';
import express from 'express';

import { DatabaseWriter, createDatabaseReader } from '../lib';

import { createHomeAggregator } from './aggregators';
import { MessageStore } from './message-store';
import { Startable } from './types';

const MESSAGE_STORE_URL = env.get('MESSAGE_STORE_URL').required().asString();
const PORT = env.get('EXPRESS_PORT').required().asPortNumber();

async function main() {
  const dbReader = await createDatabaseReader(MESSAGE_STORE_URL);
  const dbWriter = new DatabaseWriter(MESSAGE_STORE_URL);
  const messageStore = new MessageStore(dbWriter);

  const homeAggregator = createHomeAggregator(dbReader, messageStore);
  const aggregators: Startable[] = [homeAggregator];
  for (const ag of aggregators) {
    await ag.start();
  }

  const app = express();

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
