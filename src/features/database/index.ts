import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import { type Identity } from '../../shared/types';
import { configService } from '../config/config.service';
import * as schema from './schema';

function createClient(client: postgres.Sql) {
  return drizzle(client, { schema, logger: true });
}

const migrationClient = createClient(
  postgres(configService.getEnv('DATABASE_URL'), { max: 1 }),
);

await migrate(migrationClient, {
  migrationsFolder: `${import.meta.dir}/migrations`,
});

export const drizzleClient = createClient(
  postgres(configService.getEnv('DATABASE_URL')),
);

export interface DrizzleClient extends Identity<typeof drizzleClient> {}

interface Tables extends Omit<typeof schema, `${string}Relations`> {}

export const tables: Tables = schema;
