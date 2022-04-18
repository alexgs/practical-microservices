/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { MessageDatabase } from '../../lib';

import {
  createSubscriptionFactory,
  CreateSubscriptionFn,
} from './subscription-factory';
import { readerFactory } from './reader-factory';
import { Reader, WriteFn } from './types';
import { writerFactory } from './writer-factory';

// TODO Refactor to factory pattern
class MessageStore {
  private db: MessageDatabase;

  public write: WriteFn;
  public createSubscription: CreateSubscriptionFn;
  public read: Reader['read'];
  public readLastMessage: Reader['readLastMessage'];

  constructor(database: MessageDatabase) {
    this.db = database;
    const reader = readerFactory(database);

    this.read = reader.read;
    this.readLastMessage = reader.readLastMessage;
    this.write = writerFactory(database);

    this.createSubscription = createSubscriptionFactory({
      read: this.read,
      readLastMessage: this.readLastMessage,
      write: this.write,
    });
  }
}

export { MessageStore };
