import { tables } from '../database';
import { type DatabaseManager } from '../database/database-manager';
import { type PollId, type PollOption } from '../database/schema';

export class PollOptionsRepository {
  constructor(private readonly databaseManager: DatabaseManager) {}

  async createMany(
    pollId: PollId,
    { options }: { options: string[] },
  ): Promise<Array<Omit<PollOption, 'pollId'>>> {
    const db = this.databaseManager.getClient();

    return db
      .insert(tables.pollOptions)
      .values(options.map((option) => ({ label: option, pollId })))
      .returning({
        id: tables.pollOptions.id,
        label: tables.pollOptions.label,
      });
  }
}
