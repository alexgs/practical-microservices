/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Startable } from '../types';

export { createAggregator as createHomeAggregator } from './home';

export const PAGES = {
  HOME: 'home',
};

export interface Aggregator extends Startable {
  /* eslint-disable @typescript-eslint/ban-types */
  handlers: Record<string, Function>;
  init: () => void;
  queries: Record<string, Function>;
  /* eslint-enable @typescript-eslint/ban-types */
}
