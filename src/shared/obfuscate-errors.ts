import { Elysia } from 'elysia';

import { configServiceProvider } from '../features/config/config.service.plugin';

export const obfuscateErrors = new Elysia({ name: '@app/obfuscate-errors' })
  .use(configServiceProvider)
  .onError((ctx) => {
    if (ctx.configService.getEnv('NODE_ENV') === 'PRODUCTION') {
      switch (ctx.code) {
        case 'VALIDATION': {
          if (ctx.error.type === 'params') {
            ctx.set.status = 404;

            type $ParsedMessage = {
              found: Record<string, string>;
              at: string;
            };

            const message: $ParsedMessage = JSON.parse(ctx.error.message);

            return `Entity not found: ${message.found[message.at]}`;
          }

          break;
        }
        default: {
          break;
        }
      }
    }

    return ctx.error;
  });
