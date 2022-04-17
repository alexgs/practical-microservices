/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { NextFunction, Response } from 'express';
import { v4 as generateUuid } from 'uuid';

import { WinterfellRequest } from './types';

export function addRequestContext(req: WinterfellRequest, res: Response, next: NextFunction): void {
  req.context = {
    traceId: generateUuid(),
  };
  next();
}
