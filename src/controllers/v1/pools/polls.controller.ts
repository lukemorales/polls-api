import { createElysia } from '../../../shared/elysia';
import { createPoll } from './create-poll';
import { createVote } from './create-vote';
import { findPoll } from './find-poll';
import { livePoll } from './live-poll';
// import { livePollForRouteGroup } from './live-poll.for-route-group';

export const pollsController = createElysia({ prefix: '/polls' })
  .use(createPoll)
  .group('/:id', (app) => app.use(findPoll).use(createVote))
  .use(livePoll);

// for some reason the setup below does not work:
// .use(livePoll) inside group("/:id")

// export const pollsController = createElysia({ prefix: '/polls' })
//   .use(createPoll)
//   .group('/:id', (app) =>
//     app.use(findPoll).use(createVote).use(livePollForRouteGroup),
//   );
