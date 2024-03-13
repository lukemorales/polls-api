import { createElysia } from '../../shared/elysia';
import { databaseManagerProvider } from '../database/database-manager.plugin';
import { PollsRepository } from './polls.repository';

export const pollsRepositoryProvider = createElysia({
  name: '@repositories/polls-repository',
})
  .use(databaseManagerProvider)
  .decorate((deps) => ({
    pollsRepository: new PollsRepository(deps.databaseManager),
  }));
