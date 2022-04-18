/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import * as env from 'env-var';

import { MessageDatabase, ViewDatabase, createViewDbClient } from '../lib';

import { MessageStore } from './message-store';

export interface Config {
  env: {
    MESSAGE_STORE_URL: string;
    PORT: number;
  };
  messageStore: MessageStore;
  viewDb: ViewDatabase;
}

const MESSAGE_STORE_URL = env.get('MESSAGE_STORE_URL').required().asString();
const PORT = env.get('EXPRESS_PORT').required().asPortNumber();

export async function getConfig(): Promise<Config> {
  const messageDb = new MessageDatabase(MESSAGE_STORE_URL);
  const messageStore = new MessageStore(messageDb);
  const viewDb = await createViewDbClient(MESSAGE_STORE_URL);

  return {
    env: {
      MESSAGE_STORE_URL,
      PORT,
    },
    messageStore,
    viewDb,
  };
}
