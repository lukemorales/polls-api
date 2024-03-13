import { createSelectSchema } from 'drizzle-typebox';
import { Elysia, t } from 'elysia';

import { tables } from '../features/database';
import { type VoteId } from '../features/database/schema';
import { tBrandedId } from '../shared/branded-id-validation';
import { pollBrandedId, pollOptionBrandedId } from './poll.model';

const voteSchema = createSelectSchema(tables.votes, {
  id: tBrandedId<VoteId>(),
  pollId: pollBrandedId,
  pollOptionId: pollOptionBrandedId,
});

export const voteModel = new Elysia().model({
  vote: voteSchema,
  'vote.create.payload': t.Object({
    pollOptionId: pollOptionBrandedId,
  }),
});
