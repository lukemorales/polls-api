import { Elysia } from 'elysia';

import { healthController } from './health/health.controller';
import { v1Controller } from './v1/v1.controller';

export const controllers = new Elysia().use(healthController).use(v1Controller);
