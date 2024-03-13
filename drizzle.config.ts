import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/features/database/schema.ts',
  out: './src/features/database/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
