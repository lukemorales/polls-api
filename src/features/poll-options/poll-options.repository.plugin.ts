import { createElysia } from '../../shared/elysia';
import { databaseManagerProvider } from '../database/database-manager.plugin';
import { PollOptionsRepository } from './poll-options.repository';

export const pollOptionsRepositoryProvider = createElysia({
  name: '@repositories/poll-options-repository',
})
  .use(databaseManagerProvider)
  .decorate((deps) => ({
    pollOptionsRepository: new PollOptionsRepository(deps.databaseManager),
  }));
