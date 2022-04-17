/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import express, { Express } from 'express';
import { join } from 'path';

import { Config } from './config';
// const mountMiddleware = require('./mount-middleware')
// const mountRoutes = require('./mount-routes')

export function createExpressApp(config: Config): Express {
  const app = express();

  // Configure PUG
  app.set('views', join(__dirname, '..'));
  app.set('view engine', 'pug');

  // mountMiddleware(app, env) // (4)
  // mountRoutes(app, config) // (5)

  return app;
}
