/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import express, { NextFunction, Response, Router } from 'express';

import { ViewDatabase } from '../../../lib';
import { Config } from '../../config';
import { WinterfellRequest } from '../types';

function createHandlers(/* queries: ReturnType<typeof createQueries> */) {
  function home(req: WinterfellRequest, res: Response, next: NextFunction) {
    // TODO+++ Connect a query to make this number reflect events in the database
    // const homepage = await queries.loadHomePage();
    // console.log(`>> ${JSON.stringify(homepage)} <<`);
    // res.render('express/templates/home', homepage?.data ?? { videosWatched: 0 });
    res.render('express/templates/home', { videosWatched: 11 });
  }

  return {
    home,
  };
}

interface PagesRow<Json> {
  name: string;
  data: Json;
}

interface HomeData {
  videosWatched: number;
  lastViewProcessed: number;
}

function createQueries(db: ViewDatabase) {
  async function loadHomePage() {
    return db<PagesRow<HomeData>>('pages').where({ name: 'home' }).first();
  }

  return {
    loadHomePage,
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
  // const queries = createQueries(config.viewDb);
  const handlers = createHandlers();
  const router = express.Router();
  router.route('/').get(handlers.home);

  return { handlers, queries: {}, router };
}
