import { drizzleClient, type DrizzleClient } from '../database';
import {
  transactionContext,
  type TransactionContext,
} from './transaction-context';

export class TransactionManager {
  private static instance: TransactionManager | undefined;

  readonly #drizzle: DrizzleClient;

  readonly #transactionContext: TransactionContext;

  private constructor(drizzle: DrizzleClient, context: TransactionContext) {
    this.#drizzle = drizzle;
    this.#transactionContext = context;
  }

  static getInstance(): TransactionManager {
    this.instance ??= new TransactionManager(drizzleClient, transactionContext);

    return this.instance;
  }

  async execute<T>(fn: (tx: DrizzleClient) => Promise<T>): Promise<T> {
    const client = this.#transactionContext.getStore()?.transactionClient;

    if (client) {
      return fn(client);
    }

    return this.#drizzle.transaction((tx) =>
      this.#transactionContext.run({ transactionClient: tx }, async () => {
        try {
          return await fn(tx);
        } catch (err) {
          this.#transactionContext.enterWith({ transactionClient: null });

          throw err;
        }
      }),
    );
  }
}
