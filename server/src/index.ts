/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as env from 'env-var';
import express from 'express';

import { DatabaseWriter } from '../lib';

import { MessageStore } from './message-store';

const MESSAGE_STORE_URL = env.get('MESSAGE_STORE_URL').required().asString();
const PORT = env.get('EXPRESS_PORT').required().asPortNumber();

const dbClient = new DatabaseWriter(MESSAGE_STORE_URL);
const messageStore = new MessageStore(dbClient);

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
