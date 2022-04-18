/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { Request } from 'express';

export interface WinterfellRequest extends Request {
  // I don't like it, but making the `context` optional is the only way to make
  //   TypeScript happy.
  context?: {
    traceId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}
