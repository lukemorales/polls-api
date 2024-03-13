import { eq } from 'drizzle-orm';
import { A, O } from 'funkcia';

import { tables } from '../database';
import { type DatabaseManager } from '../database/database-manager';
import { type Poll, type PollId, type PollOption } from '../database/schema';

export interface PollOptionPayload extends Omit<PollOption, 'pollId'> {}

export interface PollWithOptions extends Poll {
  options: PollOptionPayload[];
}

export class PollsRepository {
  constructor(private readonly databaseManager: DatabaseManager) {}

  async create(title: string): Promise<Poll> {
    const db = this.databaseManager.getClient();

    const poll = await db
      .insert(tables.polls)
      .values({ title })
      .returning()
      .then(A.head);

    return poll.pipe(O.unwrap);
  }

  async find(id: PollId): O.AsyncOption<PollWithOptions> {
    const db = this.databaseManager.getClient();

    return db.query.polls
      .findFirst({
        where: eq(tables.polls.id, id),
        with: {
          options: {
            columns: { id: true, label: true },
          },
        },
      })
      .then(O.fromNullable);
  }
}
