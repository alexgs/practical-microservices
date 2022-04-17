/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

import { Client, QueryResult } from 'pg';

class DatabaseWriter {
  private client: Client;
  private isConnected: boolean;

  constructor(connectionString: string) {
    this.client = new Client({ connectionString });
    this.isConnected = false;
  }

  async query<R>(text: string, params: unknown[]): Promise<QueryResult<R>> {
    if (!this.isConnected) {
      await this.client.connect();
      await this.client.query('SET search_path = message_store, public');
      this.isConnected = true;
    }

    return this.client.query(text, params);
  }

  async stop(): Promise<null> {
    await this.client.end();
    return null;
  }
}

export { DatabaseWriter };
