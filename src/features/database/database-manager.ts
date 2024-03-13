import {
  transactionContext,
  type TransactionContext,
} from '../transaction-manager/transaction-context';

import { drizzleClient, type DrizzleClient } from '.';

export class DatabaseManager {
  private static instance: DatabaseManager | undefined;

  readonly #drizzle: DrizzleClient;

  readonly #transactionContext: TransactionContext;

  private constructor(drizzle: DrizzleClient, context: TransactionContext) {
    this.#drizzle = drizzle;
    this.#transactionContext = context;
  }

  static getInstance(): DatabaseManager {
    this.instance ??= new DatabaseManager(drizzleClient, transactionContext);

    return this.instance;
  }

  getClient(): DrizzleClient {
    return (
      this.#transactionContext.getStore()?.transactionClient ?? this.#drizzle
    );
  }
}
