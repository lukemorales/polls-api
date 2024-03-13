import { and, eq } from 'drizzle-orm';
import { A, O } from 'funkcia';

import { tables } from '../database';
import { type DatabaseManager } from '../database/database-manager';
import { type PollId, type PollOptionId, type Vote } from '../database/schema';

type FindBySessionAndPollIdOptions = {
  pollId: PollId;
};

type UpsertVoteOptions = {
  sessionId: string;
  pollOptionId: PollOptionId;
};

export class VotesRepository {
  constructor(private readonly databaseManager: DatabaseManager) {}

  async findBySessionAndPollId(
    sessionId: string,
    options: FindBySessionAndPollIdOptions,
  ): O.AsyncOption<Vote> {
    const db = this.databaseManager.getClient();

    return db.query.votes
      .findFirst({
        where: and(
          eq(tables.votes.sessionId, sessionId),
          eq(tables.votes.pollId, options.pollId),
        ),
      })
      .then(O.fromNullable);
  }

  async upsert(pollId: PollId, options: UpsertVoteOptions): Promise<Vote> {
    const db = this.databaseManager.getClient();

    const poll = await db
      .insert(tables.votes)
      .values({ pollId, ...options })
      .returning()
      .onConflictDoUpdate({
        target: [tables.votes.sessionId, tables.votes.pollId],
        set: { pollOptionId: options.pollOptionId },
      })
      .then(A.head);

    return poll.pipe(O.unwrap);
  }
}
