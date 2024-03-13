import { createElysia } from '../../shared/elysia';
import { VotingPubSub } from './voting.pub-sub';

export const votingPubSubProvider = createElysia({
  name: '@services/voting-pub-sub',
}).decorate('votingPubSub', new VotingPubSub());
