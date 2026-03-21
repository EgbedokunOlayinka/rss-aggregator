import {sql} from 'drizzle-orm';
import {db} from '..';
import {feeds, users} from '../schema';

export type Feed = typeof feeds.$inferSelect;

export async function createFeed({
  name,
  url,
  userId,
}: {
  name: string;
  url: string;
  userId: string;
}) {
  const [result] = await db
    .insert(feeds)
    .values({
      name,
      url,
      user_id: userId,
    })
    .returning();
  return result;
}

export async function getFeeds() {
  const result = await db.query.feeds.findMany({
    with: {
      user: true,
    },
  });

  // const result = await db.execute(
  //   sql`SELECT *, users.name AS username FROM feeds LEFT JOIN users ON feeds.user_id = users.id;`,
  // );

  return result;
}

export async function getFeedByURL(url: string) {
  const [result] = await db
    .select()
    .from(feeds)
    .where(sql`(${feeds.url}) = ${url}`);
  return result;
}
