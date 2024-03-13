import { t } from 'elysia';
import { exhaustive } from 'exhaustive';
import { O, R } from 'funkcia';

import { configServiceProvider } from '../../../features/config/config.service.plugin';
import { votesServiceProvider } from '../../../features/votes/votes.service.plugin';
import { createElysia } from '../../../shared/elysia';

export const createVote = createElysia()
  .use(votesServiceProvider)
  .use(configServiceProvider)
  .guard({ cookie: 'cookie.session' }, (app) =>
    app
      .resolve((ctx) => {
        const sessionId = O.fromNullable(ctx.cookie.sid.value).pipe(
          O.getOrElse(() => {
            const sid = crypto.randomUUID();
            ctx.cookie.sid.set({
              ...ctx.configService.defaults('COOKIES'),
              value: sid,
            });

            return sid;
          }),
        );

        return { sessionId };
      })
      .post(
        '/vote',
        async (ctx) => {
          const { sessionId } = ctx;
          const { pollOptionId } = ctx.body;

          const vote = await ctx.votesService
            .processVote(ctx.params.id, { sessionId, pollOptionId })
            .then(
              R.expect((error) =>
                exhaustive.tag(error, '_tag', {
                  UserHasAlreadyVoted: () =>
                    ctx.httpError.Conflict(
                      `You have already voted on this poll`,
                    ),
                }),
              ),
            );

          ctx.set.status = 201;

          return vote;
        },
        {
          params: 'poll.route.params',
          body: 'vote.create.payload',
          response: {
            201: 'vote',
            409: t.String(),
          },
        },
      ),
  );
