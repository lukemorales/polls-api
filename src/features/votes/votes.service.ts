import { O, R } from 'funkcia';
import { type Redis } from 'ioredis';

import { type PollId, type PollOptionId, type Vote } from '../database/schema';
import { UserHasAlreadyVoted } from './votes.exceptions';
import { type VotesRepository } from './votes.repository';
import { type VotingPubSub } from './voting.pub-sub';

type ProcessVoteOption = {
  sessionId: string;
  pollOptionId: string;
};

export class VotesService {
  constructor(
    private readonly redis: Redis,
    private readonly votesRepository: VotesRepository,
    private readonly votingPubSub: VotingPubSub,
  ) {}

  async processVote(
    pollId: string,
    options: ProcessVoteOption,
  ): R.AsyncResult<UserHasAlreadyVoted, Vote> {
    const previousVote = await this.votesRepository.findBySessionAndPollId(
      options.sessionId,
      { pollId: pollId as PollId },
    );

    if (O.isSome(previousVote)) {
      const previousPollOptionId = previousVote.value.pollOptionId;

      const isDuplicatedVote = previousPollOptionId === options.pollOptionId;

      if (isDuplicatedVote) {
        return R.error(UserHasAlreadyVoted.raise());
      }

      const score = await this.redis.zincrby(pollId, -1, previousPollOptionId);

      this.votingPubSub.publish(pollId as PollId, {
        pollOptionId: previousPollOptionId,
        score: parseInt(score, 10),
      });
    }

    const vote = await this.votesRepository.upsert(pollId as PollId, {
      sessionId: options.sessionId,
      pollOptionId: options.pollOptionId as PollOptionId,
    });

    const score = await this.redis.zincrby(vote.pollId, 1, vote.pollOptionId);

    this.votingPubSub.publish(vote.pollId, {
      pollOptionId: vote.pollOptionId,
      score: parseInt(score, 10),
    });

    return R.ok(vote);
  }
}
