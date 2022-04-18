/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { MessageDatabase } from '../../lib';

import {
  createSubscriptionFactory,
  CreateSubscriptionFn,
} from './create-subscription-factory';
import { WriteFn } from './types';
import { writerFactory } from './writer-factory';

class MessageStore {
  private db: MessageDatabase;

  public write: WriteFn;
  // public createSubscription: CreateSubscriptionFn;

  constructor(database: MessageDatabase) {
    this.db = database;

    // @ts-ignore -- until everything is implemented
    // this.createSubscription = createSubscriptionFactory({});
    this.write = writerFactory(database);
  }
}

export { MessageStore };
