/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import express, { NextFunction, Response, Router } from 'express';
import { v4 as generateUuid } from 'uuid';

import { Config } from '../../config';
import { EventInput } from '../../message-store';
import { WinterfellRequest } from '../types';

function createActions(config: Config) {
  function recordViewing(traceId: string, videoId: string, userId: string) {
    const viewedEvent: EventInput = { // (2)
      id: generateUuid(),
      type: 'VideoViewed',
      metadata: {
        traceId,
        userId,
      },
      data: {
        userId,
        videoId,
      },
    };
    const streamName = `viewing-${videoId}`; // (3)

    return config.messageStore.write(streamName, viewedEvent); // (4)
  }

  return { recordViewing };
}

function createHandlers(actions: ReturnType<typeof createActions>) {
  async function handleRecordViewing(req: WinterfellRequest, res: Response) {
    await actions.recordViewing(
      req.context?.traceId ?? 'none',
      req.params.videoId,
      req.context?.userId ?? 'none',
    );
    res.redirect('/');
  }

  return { handleRecordViewing };
}

interface Output {
  actions: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [name: string]: (...args: any[]) => void;
  };
  handlers: {
    [name: string]: (req: WinterfellRequest, res: Response, next: NextFunction) => void;
  };
  router: Router;
}

export function createRecordViewings(config: Config): Output {
  const actions = createActions(config);
  const handlers = createHandlers(actions);

  const router = express.Router();
  router.route('/:videoId').post(handlers.handleRecordViewing);

  return { actions, handlers, router };
}
