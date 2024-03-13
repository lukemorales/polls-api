import { t } from 'elysia';
import { R } from 'funkcia';

import { pollCreatorProvider } from '../../../features/poll-creator/poll-creator.plugin';
import { createElysia } from '../../../shared/elysia';

export const createPoll = createElysia()
  .use(pollCreatorProvider)
  .post(
    '/',
    async (ctx) => {
      const pollResult = await ctx.pollCreator.create(ctx.body);

      const poll = pollResult.pipe(
        R.expect((error) =>
          ctx.httpError.BadRequest(
            `Failed to create poll "${ctx.body.title}"`,
            error,
          ),
        ),
      );

      ctx.set.status = 201;

      return poll;
    },
    {
      body: 'poll.create.payload',
      response: {
        201: 'poll',
        400: t.String(),
      },
    },
  );
