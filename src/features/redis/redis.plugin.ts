import { Redis } from 'ioredis';

import { createElysia } from '../../shared/elysia';

export const redisProvider = createElysia({
  name: '@services/redis',
}).decorate('redis', new Redis());
