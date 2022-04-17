/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import express, { Express } from 'express';
import { join } from 'path';

import { Config } from '../config';

import { mountMiddleware } from './middleware';

export function createExpressApp(config: Config): Express {
  const app = express();

  // Configure PUG
  app.set('views', join(__dirname, '..'));
  app.set('view engine', 'pug');

  mountMiddleware(app);
  // mountRoutes(app, config) // (5)

  return app;
}
