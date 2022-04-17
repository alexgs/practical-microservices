/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { NextFunction, Request, Response } from 'express';

import { WinterfellRequest } from './types';

export function lastResortErrorHandler(
  err: Error,
  req: WinterfellRequest,
  res: Response,
  next: NextFunction,
): void {
  const traceId = req.context?.traceId ?? 'none';
  console.error(traceId, err);

  res.status(500).send('error');
}
