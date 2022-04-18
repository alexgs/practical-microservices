/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { createHomeAggregator } from './aggregators';
import { getConfig } from './config';
import { createExpressApp } from './express';
import { Startable } from './types';

async function main() {
  const config = await getConfig();
  const homeAggregator = createHomeAggregator(config);
  const aggregators: Startable[] = [homeAggregator];
  for (const ag of aggregators) {
    await ag.start();
  }

  const app = createExpressApp(config);

  app.listen(config.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${config.env.PORT}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
