import { exhaustive } from 'exhaustive';
import { z } from 'zod';

export const envSchema = z.object({
  JWT_SECRET: z.string().optional(),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  RUNTIME: z.enum(['bun', 'edge']).default('bun'),
  NODE_ENV: z
    .enum(['development', 'production'])
    .default('development')
    .transform<'DEVELOPMENT' | 'PRODUCTION'>((env) =>
      exhaustive(env, {
        development: () => 'DEVELOPMENT',
        production: () => 'PRODUCTION',
      }),
    ),
  AUTH_TOKEN: z.string().optional(),
  COOKIE_SECRET: z.string(),
});
