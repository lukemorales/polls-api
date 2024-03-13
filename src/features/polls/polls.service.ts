import { O } from 'funkcia';
import type Redis from 'ioredis';

import { type Poll, type PollId, type PollOptionId } from '../database/schema';
import {
  type PollOptionPayload,
  type PollsRepository,
} from './polls.repository';

export interface PollOptionWithScore extends PollOptionPayload {
  score: number;
}

export interface PollWithOptionsAndScore extends Poll {
  options: PollOptionWithScore[];
}

export class PollsService {
  constructor(
    private readonly redis: Redis,
    private readonly pollsRepository: PollsRepository,
  ) {}

  async find(id: string): O.AsyncOption<PollWithOptionsAndScore> {
    const maybePoll = await this.pollsRepository.find(id as PollId);

    return maybePoll.pipe(
      O.match(O.none, async (poll) => {
        /**
         * Even indexes are the pollOptionId
         *
         * Odd indexes are the score as string
         *
         * @example
         * ['poll_opt_1', '0', 'poll_opt_2', '1'...]
         */
        const pollVotes = await this.redis.zrange(poll.id, 0, -1, 'WITHSCORES');

        const votesByPollOptionId = pollVotes.reduce(
          (map, line, index, self) => {
            if (index % 2 === 0) {
              const score = self[index + 1] ?? '0';

              map.set(line as PollOptionId, parseInt(score, 10));
            }

            return map;
          },
          new Map<PollOptionId, number>(),
        );

        const pollOptionsWithScore = poll.options.map((option) => ({
          ...option,
          score: votesByPollOptionId.get(option.id) ?? 0,
        }));

        return O.some<PollWithOptionsAndScore>({
          ...poll,
          options: pollOptionsWithScore,
        });
      }),
    );
  }
}
