import { createElysia } from '../../shared/elysia';
import { redisProvider } from '../redis/redis.plugin';
import { votesRepository } from './votes.repository.plugin';
import { VotesService } from './votes.service';
import { votingPubSubProvider } from './voting.pub-sub.plugin';

export const votesServiceProvider = createElysia({
  name: '@services/votes-service',
})
  .use(redisProvider)
  .use(votesRepository)
  .use(votingPubSubProvider)
  .decorate((deps) => ({
    votesService: new VotesService(
      deps.redis,
      deps.votesRepository,
      deps.votingPubSub,
    ),
  }));
