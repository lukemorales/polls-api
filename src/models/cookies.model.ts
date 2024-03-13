import { Elysia, t } from 'elysia';

export const cookiesModel = new Elysia().model({
  'cookie.session': t.Cookie({
    sid: t.Optional(t.String()),
  }),
});
