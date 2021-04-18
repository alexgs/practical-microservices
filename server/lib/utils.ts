/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { random } from 'lodash';

export const logger = {
  debug: (...args: unknown[]): void => {
    if (process.env.NODE_ENV === 'development') {
      console.log(args);
    }
  },
};

export function pickOne<T>(list: T[]): T {
  const index = random(list.length - 1);
  return list[index];
}

export async function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
