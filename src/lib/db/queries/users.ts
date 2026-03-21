import {sql} from 'drizzle-orm';
import {db} from '..';
import {users} from '../schema';

export type User = typeof users.$inferSelect;

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({name: name}).returning();
  return result;
}

export async function getUserByName(name: string) {
  const [result] = await db
    .select()
    .from(users)
    .where(sql`lower(${users.name}) = ${name}`);
  return result;
}

export async function getUsers() {
  const result = await db.select().from(users);
  return result;
}

export async function deleteUsers() {
  await db.execute(sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE;`);
}
