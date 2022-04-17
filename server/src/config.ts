/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import * as env from 'env-var';

import { DatabaseReader, DatabaseWriter, createDatabaseReader } from '../lib';

import { MessageStore } from './message-store';

export interface Config {
  dbReader: DatabaseReader;
  dbWriter: DatabaseWriter;
  env: {
    MESSAGE_STORE_URL: string;
    PORT: number;
  };
  messageStore: MessageStore;
}

const MESSAGE_STORE_URL = env.get('MESSAGE_STORE_URL').required().asString();
const PORT = env.get('EXPRESS_PORT').required().asPortNumber();

export async function getConfig(): Promise<Config> {
  const dbReader = await createDatabaseReader(MESSAGE_STORE_URL);
  const dbWriter = new DatabaseWriter(MESSAGE_STORE_URL);
  const messageStore = new MessageStore(dbWriter);

  return {
    dbReader,
    dbWriter,
    env: {
      MESSAGE_STORE_URL,
      PORT,
    },
    messageStore,
  };
}
