import { AsyncLocalStorage } from 'async_hooks';

import { type DrizzleClient } from '../database';

type $TransactionContext = { transactionClient: DrizzleClient | null };

export const transactionContext = new AsyncLocalStorage<$TransactionContext>();

export type TransactionContext = typeof transactionContext;
