import { DbClient, PgClient } from './database-client';

export type WinterfellEventData = JsonB;

export interface WinterfellEventMetadata extends JsonB {
  traceId: string;
  userId: number;
}

export interface WinterfellEvent {
  id: string;
  type: string;
  metadata: WinterfellEventMetadata;
  data: WinterfellEventData;
}

const SQL_FN = {
  WRITE: 'SELECT message_store.write_message($1, $2, $3, $4, $5, $6)',
};

type JsonB = Record<string, unknown>;
type WriteValues = [string, string, string, JsonB, JsonB, number];

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createMessageStore(db: DbClient, pg: PgClient) {
  return {
    getDb: (): DbClient => db,
    write: async (streamName: string, message: WinterfellEvent, expectedVersion: number) => {
      const values: WriteValues = [
        message.id,
        streamName,
        message.type,
        message.data,
        message.metadata,
        expectedVersion,
      ];
      return pg.query(SQL_FN.WRITE, values);
    },
  }
}
