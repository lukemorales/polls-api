import { t } from 'elysia';

export function tBrandedId<T>() {
  return t.Unsafe<T>(t.String());
}
