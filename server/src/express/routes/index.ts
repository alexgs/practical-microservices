/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { Express } from 'express';

import { Config } from '../../config';

import { createHomepageApp } from './home';
import { createRecordViewings } from './record-viewings';

export function mountRoutes(app: Express, config: Config): void {
  app.get('/', createHomepageApp(config).router);
  app.use('/record-viewing', createRecordViewings(config).router);
}
