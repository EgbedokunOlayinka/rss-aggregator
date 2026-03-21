import {eq, sql} from 'drizzle-orm';
import {db} from '..';
import {feedFollows, feeds} from '../schema';

export type FeedFollow = typeof feedFollows.$inferSelect;

export async function createFeedFollow({
  userId,
  feedId,
}: {
  userId: string;
  feedId: string;
}) {
  const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({
      user_id: userId,
      feed_id: feedId,
    })
    .returning();

  const [result] = await db.execute(
    sql`SELECT *, users.name AS user_name, feeds.name as feed_name FROM feed_follows INNER JOIN users ON feed_follows.user_id = users.id INNER JOIN feeds ON feed_follows.feed_id = feeds.id WHERE feed_follows.id = ${newFeedFollow.id};`,
  );

  return result;
}

export async function getFeedFollowsForUser(userId: string) {
  const result = await db
    .select({
      feed_name: feeds.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feed_id, feeds.id))
    .where(sql`${feedFollows.user_id} = ${userId}`);

  return result;
}
