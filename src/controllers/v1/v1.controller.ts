import { createElysia } from '../../shared/elysia';
import { pollsController } from './pools/polls.controller';

export const v1Controller = createElysia({ prefix: '/v1' }).use(
  pollsController,
);
