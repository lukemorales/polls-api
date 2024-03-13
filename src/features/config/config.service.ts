import { type ZodSchema, type z } from 'zod';

import { CONFIG_DEFAULTS } from './defaults';
import { envSchema } from './env-schema';

class ConfigService<Schema extends ZodSchema, Env extends z.output<Schema>> {
  #env: Env;

  #defaults: CONFIG_DEFAULTS;

  constructor(schema: Schema) {
    this.#env = schema.parse(process.env);
    this.#defaults = CONFIG_DEFAULTS;
  }

  getEnv<Key extends keyof Env>(key: Key): Env[Key] {
    return this.#env[key];
  }

  defaults<Key extends keyof CONFIG_DEFAULTS>(key: Key): CONFIG_DEFAULTS[Key] {
    return this.#defaults[key];
  }
}

export const configService = new ConfigService(envSchema);
