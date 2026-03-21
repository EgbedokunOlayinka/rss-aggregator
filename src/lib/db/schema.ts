import {pgTable, timestamp, uuid, text, unique} from 'drizzle-orm/pg-core';
import {relations} from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text('name').notNull().unique(),
});

export const feeds = pgTable('feeds', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text('name').notNull().unique(),
  url: text('url').notNull().unique(),
  user_id: uuid('user_id')
    .references(() => users.id, {onDelete: 'cascade'})
    .notNull(),
});

export const feedFollows = pgTable(
  'feed_follows',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    user_id: uuid('user_id')
      .references(() => users.id, {onDelete: 'cascade'})
      .notNull(),
    feed_id: uuid('feed_id')
      .references(() => feeds.id, {onDelete: 'cascade'})
      .notNull(),
  },
  t => ({
    unq: unique().on(t.user_id, t.feed_id),
  }),
);

export const feedToUserRelations = relations(feeds, ({one}) => ({
  user: one(users, {
    fields: [feeds.user_id],
    references: [users.id],
  }),
}));

export const userToFeedRelations = relations(users, ({many}) => ({
  feeds: many(feeds),
}));

export const feedFollowRelations = relations(feedFollows, ({one}) => ({
  feed: one(feeds, {
    fields: [feedFollows.feed_id],
    references: [feeds.id],
  }),
  user: one(users, {
    fields: [feedFollows.user_id],
    references: [users.id],
  }),
}));
