/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

export type MockObject<Type> = {
  [Property in keyof Type]: jest.Mock
};

export interface Startable {
  start: () => Promise<void>;
}
