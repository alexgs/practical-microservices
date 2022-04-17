/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import express, { Express } from 'express';
import { join } from 'path';

import { attachLocalContext } from './attach-local-context';
import { lastResortErrorHandler } from './last-resort-error-handler';
import { addRequestContext } from './request-context';

export function mountMiddleware(app: Express): void {
  app.use(lastResortErrorHandler);
  app.use(addRequestContext);
  app.use(attachLocalContext);
  app.use(
    express.static(join(__dirname, '..', 'public'), { maxAge: 86400000 })
  );
}
