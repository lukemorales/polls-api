import { logger } from '@bogeychan/elysia-logger';
import { type Logger } from 'drizzle-orm';
import { Elysia } from 'elysia';

import { models } from '../models';
import { httpError } from './http-error';

type ElysiaLogger = Elysia<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  { decorator: {}; store: {}; derive: { log: Logger }; resolve: {} }
>;

const setup = new Elysia({ name: '@app/setup' })
  .use(logger({ autoLogging: false }) as unknown as ElysiaLogger)
  .use(httpError)
  .use(models);

export function createElysia<
  const T extends { name?: string; prefix?: string },
>(config?: T) {
  return new Elysia(config).use(setup);
}
