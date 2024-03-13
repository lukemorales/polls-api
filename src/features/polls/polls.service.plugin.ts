import { createElysia } from '../../shared/elysia';
import { redisProvider } from '../redis/redis.plugin';
import { pollsRepositoryProvider } from './polls.repository.plugin';
import { PollsService } from './polls.service';

export const pollsServiceProvider = createElysia({
  name: '@services/polls-service',
})
  .use(pollsRepositoryProvider)
  .use(redisProvider)
  .decorate((deps) => ({
    pollsService: new PollsService(deps.redis, deps.pollsRepository),
  }));
