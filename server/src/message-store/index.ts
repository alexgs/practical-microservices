/*
 * Copyright 2021-present Phillip Gates-Shannon. All rights reserved. Licensed
 * under the Open Software License version 3.0.
 */

export { MessageStore } from './message-store';
export * from './types';

export const ALL_EVENTS_STREAM = '$all';

export function isEntityStream(streamName: string): boolean {
  // Entity stream names have a dash
  return streamName.includes('-');
}
