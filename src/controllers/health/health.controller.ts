import { createElysia } from '../../shared/elysia';
import { checkHealth } from './check-health';

export const healthController = createElysia({ prefix: '/health' }).use(
  checkHealth,
);
