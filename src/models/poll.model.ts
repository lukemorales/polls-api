import { createSelectSchema } from 'drizzle-typebox';
import { Elysia, t } from 'elysia';

import { tables } from '../features/database';
import { type PollId, type PollOptionId } from '../features/database/schema';
import { tBrandedId } from '../shared/branded-id-validation';

export const pollBrandedId = tBrandedId<PollId>();

export const basePollSchema = createSelectSchema(tables.polls, {
  id: pollBrandedId,
});

export const pollOptionBrandedId = tBrandedId<PollOptionId>();

export const basePollOptionSchema = createSelectSchema(tables.pollOptions, {
  id: pollOptionBrandedId,
  pollId: pollBrandedId,
});

export const pollOptionSchema = t.Object({
  id: basePollOptionSchema.properties.id,
  label: basePollOptionSchema.properties.label,
  score: t.Number({ default: 0 }),
});

const pollSchema = t.Object({
  ...basePollSchema.properties,
  options: t.Array(pollOptionSchema, { minItems: 2 }),
});

export const pollModel = new Elysia().model({
  poll: pollSchema,
  'poll.route.params': t.Object({
    id: pollBrandedId,
  }),
  'poll.create.payload': t.Object({
    title: t.String(),
    options: t.Array(t.String(), { minItems: 2 }),
  }),
  'poll.ws.response': t.Object({
    pollOptionId: t.String(),
    score: t.Number(),
  }),
});
