import { createElysia } from '../../shared/elysia';
import { TransactionManager } from './transaction-manager';

export const transactionManagerProvider = createElysia({
  name: '@services/transaction-manager',
}).decorate('transactionManager', TransactionManager.getInstance());
