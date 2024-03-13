import { createElysia } from '../../shared/elysia';
import { configService } from './config.service';

export const configServiceProvider = createElysia({
  name: '@services/config-service',
}).decorate('configService', configService);
