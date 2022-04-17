/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import * as env from 'env-var';

export interface Config {
  env: {
    MESSAGE_STORE_URL: string;
    PORT: number;
  }
}

export function getConfig(): Config {
  return {
    env: {
      MESSAGE_STORE_URL: env.get('MESSAGE_STORE_URL').required().asString(),
      PORT: env.get('EXPRESS_PORT').required().asPortNumber(),
    },
  };
}
