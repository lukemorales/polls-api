import { t } from 'elysia';
import { O } from 'funkcia';

import { pollsServiceProvider } from '../../../features/polls/polls.service.plugin';
import { createElysia } from '../../../shared/elysia';

export const findPoll = createElysia()
  .use(pollsServiceProvider)
  .get(
    '/',
    async (ctx) => {
      const poll = await ctx.pollsService.find(ctx.params.id);

      return poll.pipe(
        O.expect(() =>
          ctx.httpError.NotFound(`Poll "${ctx.params.id}" not found`),
        ),
      );
    },
    {
      params: 'poll.route.params',
      response: {
        200: 'poll',
        400: t.String(),
      },
    },
  );
