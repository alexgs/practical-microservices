/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { NextFunction, Response } from 'express';

import { WinterfellRequest } from './types';

export function attachLocalContext(req: WinterfellRequest, res: Response, next: NextFunction): void {
  res.locals.context = req.context ?? {};
  next();
}
