import { createElysia } from '../../shared/elysia';
import { pollOptionsRepositoryProvider } from '../poll-options/poll-options.repository.plugin';
import { pollsRepositoryProvider } from '../polls/polls.repository.plugin';
import { transactionManagerProvider } from '../transaction-manager/transaction-manager.plugin';
import { PollCreator } from './poll-creator';

export const pollCreatorProvider = createElysia({
  name: '@services/poll-creator',
})
  .use(pollsRepositoryProvider)
  .use(pollOptionsRepositoryProvider)
  .use(transactionManagerProvider)
  .decorate((deps) => ({
    pollCreator: new PollCreator(
      deps.pollsRepository,
      deps.pollOptionsRepository,
      deps.transactionManager,
    ),
  }));
