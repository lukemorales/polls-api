import { R } from 'funkcia';

import { type PollOptionsRepository } from '../poll-options/poll-options.repository';
import { type PollsRepository } from '../polls/polls.repository';
import { type PollWithOptionsAndScore } from '../polls/polls.service';
import { type TransactionManager } from '../transaction-manager/transaction-manager';

type CreatePollOptions = {
  title: string;
  options: string[];
};

export class PollCreator {
  constructor(
    private readonly pollsRepository: PollsRepository,
    private readonly pollOptionsRepository: PollOptionsRepository,
    private readonly transactionManager: TransactionManager,
  ) {}

  async create({
    title,
    options,
  }: CreatePollOptions): R.AsyncResult<unknown, PollWithOptionsAndScore> {
    return this.transactionManager
      .execute(async () => {
        const poll = await this.pollsRepository.create(title);

        const pollOptions = await this.pollOptionsRepository.createMany(
          poll.id,
          { options },
        );

        return R.ok<PollWithOptionsAndScore>({
          ...poll,
          options: pollOptions.map((option) => ({
            ...option,
            score: 0,
          })),
        });
      })
      .catch(R.error);
  }
}
