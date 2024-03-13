import { Elysia } from 'elysia';

import { cookiesModel } from './cookies.model';
import { pollModel } from './poll.model';
import { voteModel } from './vote.model';

export const models = new Elysia()
  .use(pollModel)
  .use(voteModel)
  .use(cookiesModel);
