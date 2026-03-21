import {
  createFeedFollow,
  deleteFeedFollow,
  getFeedFollowsForUser,
} from 'src/lib/db/queries/feedFollows';
import {getFeedByURL} from 'src/lib/db/queries/feeds';
import {User} from 'src/lib/db/queries/users';

export async function handlerFollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (!args?.length) {
    throw new Error('Please provide a url');
  }
  const url = args[0];

  const feedData = await getFeedByURL(url);

  const newFeedFollowData = await createFeedFollow({
    userId: user.id,
    feedId: feedData.id,
  });

  console.log(newFeedFollowData);
}

export async function handlerGetFollowing(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  const result = await getFeedFollowsForUser(user?.id);
  console.log(result);
}

export async function handlerUnfollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (!args?.length) {
    throw new Error('Please provide a url');
  }
  const url = args[0];

  const feedData = await getFeedByURL(url);

  await deleteFeedFollow({
    userId: user.id,
    feedId: feedData.id,
  });

  console.log('Feed unfollowed');
}
