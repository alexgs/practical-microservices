/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import express, { NextFunction, Response, Router } from 'express';

import { Config } from '../../config';
import { WinterfellRequest } from '../types';

function createHandlers() {
  function home(req: WinterfellRequest, res: Response, next: NextFunction) {
    res.render('express/templates/home', { videosWatched: 11 });
  }

  return {
    home,
  };
}

interface Output {
  handlers: {
    [name: string]: (req: WinterfellRequest, res: Response, next: NextFunction) => void;
  };
  queries: {
    [name: string]: (req: WinterfellRequest, res: Response, next: NextFunction) => void;
  };
  router: Router;
}

export function createHomepageApp(config: Config): Output {
  const handlers = createHandlers();
  const router = express.Router();
  router.route('/').get(handlers.home);

  return { handlers, queries: {}, router };
}
