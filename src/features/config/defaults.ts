import { type SetCookieOptions } from '@elysiajs/cookie';

export const CONFIG_DEFAULTS = {
  COOKIES: {
    path: '/',
    signed: true,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  } satisfies SetCookieOptions,
} as const;

export type CONFIG_DEFAULTS = typeof CONFIG_DEFAULTS;
