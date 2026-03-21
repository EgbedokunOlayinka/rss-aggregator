import {
  CommandsRegistry,
  registerCommand,
  runCommand,
} from './commands/commands';
import {handlerFollow, handlerGetFollowing} from './commands/feedFollows';
import {
  handlerAddFeed,
  handlerFetchFeed,
  handlerGetFeeds,
} from './commands/feeds';
import {
  handlerGetUsers,
  handlerLogin,
  handlerRegister,
  handlerReset,
} from './commands/users';
import {loggedIn} from './middleware';

async function main() {
  const commands: CommandsRegistry = {};

  registerCommand(commands, 'login', handlerLogin);
  registerCommand(commands, 'register', handlerRegister);
  registerCommand(commands, 'reset', handlerReset);
  registerCommand(commands, 'users', handlerGetUsers);

  registerCommand(commands, 'agg', handlerFetchFeed);
  registerCommand(commands, 'addfeed', loggedIn(handlerAddFeed));
  registerCommand(commands, 'feeds', handlerGetFeeds);

  registerCommand(commands, 'follow', loggedIn(handlerFollow));
  registerCommand(commands, 'following', loggedIn(handlerGetFollowing));

  const args = process.argv.slice(2);
  if (!args.length) {
    console.log('Not enough arguments provided');
    process.exit(1);
  }

  try {
    await runCommand(commands, args[0], ...args.slice(1));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
