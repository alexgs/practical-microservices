import { DbClient } from './database-client';

export type WinterfellEventData = Record<string, unknown>;

export interface WinterfellEventMetadata {
  traceId: string;
  userId: number;
}

export interface WinterfellEvent {
  id: string;
  type: string;
  metadata: WinterfellEventMetadata;
  data: WinterfellEventData;
}

export function createMessageStore(db: DbClient) {
  return {
    getDb: (): DbClient => db,
    write: (streamName: string, message: WinterfellEvent) => null,
  }
}
