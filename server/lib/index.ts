/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

export { DbClient, PgClient, db, pg } from './database-client';

export const logger = {
  debug: (...args: unknown[]): void => {
    if (process.env.NODE_ENV === 'development') {
      console.log(args);
    }
  },
};

export async function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
