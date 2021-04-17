/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

interface Startable {
  start: () => void;
}

interface Aggregator extends Startable {
  init: () => void;
}

export function createAggregator(): Aggregator {

  return {
    init: () => { return },
    start: () => { return },
  }
}
