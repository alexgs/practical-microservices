/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

export interface EventInput {
  id: string;
  type: string;
  metadata?: WinterfellEventMetadata;
  data: WinterfellEventData;
}

export type JsonB = Record<string, unknown>;

export type WinterfellEventData = JsonB;

export interface WinterfellEvent extends EventInput {
  global_position: number;
  position: number;
  stream_name: string;
}

export interface WinterfellEventMetadata extends JsonB {
  traceId: string;
  userId: number;
}
