import {XMLParser, XMLValidator} from 'fast-xml-parser';
import {createFeedFollow} from 'src/lib/db/queries/feedFollows';
import {createFeed, Feed, getFeeds} from 'src/lib/db/queries/feeds';
import {User} from 'src/lib/db/queries/users';

export async function handlerFetchFeed(cmdName: string, ...args: string[]) {
  // if (!args?.length) {
  //   throw new Error('Please provide a url');
  // }
  // const url = args[0];
  const url = 'https://www.wagslane.dev/index.xml';
  const res = await fetchFeed(url);
  console.log(res);
  // return res;
}

export async function handlerAddFeed(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args?.length < 2) {
    throw new Error('Please provide a name and a url');
  }
  const [name, url] = args;
  const feedData = await createFeed({name, url, userId: user.id});
  const feedFollowData = await createFeedFollow({
    userId: user.id,
    feedId: feedData.id,
  });
  console.log('Feed created successfully');
  printFeed(feedData, user);
}

export async function handlerGetFeeds(cmdName: string, ...args: string[]) {
  const res = await getFeeds();
  console.log(res);
  // return res;
}

async function fetchFeed(feedURL: string) {
  try {
    const res = await fetch(feedURL, {
      method: 'GET',
      headers: {'User-Agent': 'gator'},
    });

    const xmlRes = await res.text();
    if (!XMLValidator.validate(xmlRes)) {
      throw new Error('Invalid XML data!');
    }

    const parser = new XMLParser();
    const parsedData = parser.parse(xmlRes)?.rss;
    if (
      !parsedData?.channel ||
      !parsedData?.channel?.title ||
      !parsedData?.channel?.link ||
      !parsedData?.channel?.description
    ) {
      throw new Error('Invalid response');
    }
    const channel = parsedData.channel;

    const items = !channel.item
      ? []
      : Array.isArray(channel.item)
        ? [...channel.item]
        : [channel.item];

    const result = {
      title: channel.title,
      link: channel.link,
      description: channel.description,
      item: items.filter(
        item => item.title && item.link && item.description && item.pubDate,
      ),
    };

    return result;
  } catch (error) {
    console.error(error);
  }
}

function printFeed(feed: Feed, user: User) {
  console.log({
    user,
    feed,
  });
}
