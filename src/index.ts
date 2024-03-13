import { Elysia } from 'elysia';

import { app } from './app';
import { configService } from './features/config/config.service';

app.listen(configService.getEnv('PORT'), (server) => {
  // eslint-disable-next-line no-console
  console.log(`🦊 Elysia is running at ${server.url}`);
});

const wss = new Elysia(undefined).ws('/', {
  open(ws) {
    ws.send(`you are connected at ${ws.data.params.id} ${ws.id} `);
  },
  close(ws) {
    console.log(`connection closed at ${ws.data.params.id}`, ws.id);
  },
});

new Elysia({ prefix: '/ws' })
  .ws('/', {
    open(ws) {
      ws.send(`you are connected ${ws.id}`);
    },
    close(ws) {
      console.log('connection closed ', ws.id);
    },
  })
  .group('/:id', (ap) =>
    ap
      .get('/', (ctx) => {
        console.log(`get ${ctx.params.id}`);

        return 'hello world';
      })
      .use(wss),
  )
  .listen(8080, (server) => {
    // eslint-disable-next-line no-console
    console.log(`🦊 Elysia is running at ${server.url}`);
  });
