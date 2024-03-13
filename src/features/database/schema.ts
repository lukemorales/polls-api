import { relations, type InferSelectModel } from 'drizzle-orm';
import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import { entityId, type ExtractBrandedId } from './entity-id';

const pollId = entityId('poll');

export const polls = pgTable('polls', {
  id: pollId('id'),
  title: varchar('title').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export interface Poll extends InferSelectModel<typeof polls> {}

export type PollId = ExtractBrandedId<typeof pollId>;

const pollOptionId = entityId('poll_opt');

export const pollOptions = pgTable(
  'poll_options',
  {
    id: pollOptionId('id'),
    label: varchar('label').notNull(),
    pollId: pollId
      .$ref('poll_id')
      .references(() => polls.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  },
  (table) => ({
    pollIdIndex: index('poll_id_idx_on_poll_options').on(table.pollId),
  }),
);

export interface PollOption extends InferSelectModel<typeof pollOptions> {}

export type PollOptionId = ExtractBrandedId<typeof pollOptionId>;

const voteId = entityId('vote');

export const votes = pgTable(
  'votes',
  {
    id: voteId('id'),
    sessionId: varchar('session_id').notNull(),
    pollId: pollId
      .$ref('poll_id')
      .notNull()
      .references(() => polls.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    pollOptionId: pollOptionId
      .$ref('poll_option_id')
      .notNull()
      .references(() => pollOptions.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    vote: uniqueIndex('unique_vote_idx_on_vote').on(
      table.sessionId,
      table.pollId,
    ),
  }),
);

export interface Vote extends InferSelectModel<typeof votes> {}

export type VoteId = ExtractBrandedId<typeof voteId>;

// ***************
// ** RELATIONS **
// ***************

export const pollRelations = relations(polls, (has) => ({
  options: has.many(pollOptions),
  votes: has.many(votes),
}));

export const pollOptionsRelations = relations(pollOptions, (has) => ({
  poll: has.one(polls, {
    fields: [pollOptions.pollId],
    references: [polls.id],
  }),
  votes: has.many(votes),
}));

export const votesRelations = relations(votes, (has) => ({
  poll: has.one(polls, {
    fields: [votes.pollId],
    references: [polls.id],
  }),
  pollOption: has.one(pollOptions, {
    fields: [votes.pollOptionId],
    references: [pollOptions.id],
  }),
}));
