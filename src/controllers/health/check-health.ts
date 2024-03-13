import { t } from 'elysia';

import { createElysia } from '../../shared/elysia';

export const checkHealth = createElysia().get(
  '/',
  { status: 'ok', message: 'App is healthy and running ✅' },
  {
    response: {
      200: t.Object({ status: t.Literal('ok'), message: t.String() }),
    },
  },
);
