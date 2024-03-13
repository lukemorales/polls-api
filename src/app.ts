/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import { Elysia } from 'elysia';

import { controllers } from './controllers';
import { configService } from './features/config/config.service';
import { elysiaHttpError } from './shared/http-error';
import { obfuscateErrors } from './shared/obfuscate-errors';

export const app = new Elysia({
  cookie: {
    secrets: configService.getEnv('COOKIE_SECRET'),
    sign: ['sid'],
  },
})
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: { title: 'Polls API', version: '1.0' },
      },
    }),
  )
  .use(elysiaHttpError({ returnStringOnly: true }))
  .use(obfuscateErrors)
  .use(controllers);

export type ElysiaApp = typeof app;
