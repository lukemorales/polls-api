import { createElysia } from '../../shared/elysia';
import { DatabaseManager } from './database-manager';

export const databaseManagerProvider = createElysia({
  name: '@services/database-manager',
}).decorate('databaseManager', DatabaseManager.getInstance());
