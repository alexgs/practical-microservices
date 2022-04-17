/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { DatabaseWriter } from '../../lib';

import { writerFactory, WriteFn } from './writer-factory';

class MessageStore {
  private db: DatabaseWriter;

  public write: WriteFn;

  constructor(database: DatabaseWriter) {
    this.db = database;
    this.write = writerFactory(database);
  }
}

export { MessageStore };
