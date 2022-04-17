/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { DatabaseClient } from '../../lib';

import { writerFactory, WriteFn } from './writer-factory';

class MessageStore {
  private db: DatabaseClient;

  public write: WriteFn;

  constructor(database: DatabaseClient) {
    this.db = database;
    this.write = writerFactory(database);
  }
}

export { MessageStore };
