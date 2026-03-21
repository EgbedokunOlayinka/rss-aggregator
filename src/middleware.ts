import {CommandHandler, UserCommandHandler} from './commands/commands';
import {readConfig} from './config';
import {getUserByName} from './lib/db/queries/users';

export function loggedIn(handler: UserCommandHandler): CommandHandler {
  return async function (cmdName: string, ...args: string[]): Promise<void> {
    const currentUserName = readConfig()?.currentUserName;
    if (!currentUserName) {
      throw new Error('Invalid user');
    }
    const currentUserData = await getUserByName(currentUserName);
    if (!currentUserData) {
      throw new Error('User not found');
    }

    return handler(cmdName, currentUserData, ...args);
  };
}
