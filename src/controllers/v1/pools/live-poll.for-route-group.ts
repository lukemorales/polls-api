import { votingPubSubProvider } from '../../../features/votes/voting.pub-sub.plugin';
import { createElysia } from '../../../shared/elysia';

export const livePollForRouteGroup = createElysia()
  .use(votingPubSubProvider)
  .ws('/', {
    open(ws) {
      ws.data.votingPubSub.subscribe(ws.data.params.id, {
        connectionId: ws.id,
        subscriber(message) {
          ws.send(message);
        },
      });
    },
    close(ws) {
      ws.data.votingPubSub.unsubscribe(ws.data.params.id, {
        connectionId: ws.id,
      });
    },
    params: 'poll.route.params',
    response: 'poll.ws.response',
  });
