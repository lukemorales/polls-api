import { createElysia } from '../../shared/elysia';
import { databaseManagerProvider } from '../database/database-manager.plugin';
import { VotesRepository } from './votes.repository';

export const votesRepository = createElysia({
  name: '@repositories/votes-repository',
})
  .use(databaseManagerProvider)
  .decorate((deps) => ({
    votesRepository: new VotesRepository(deps.databaseManager),
  }));
